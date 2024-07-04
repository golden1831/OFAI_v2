import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { Collection, WithoutId } from 'mongodb';
import { MongoService } from 'src/mongo/mongo.service';
import { IUser, PlanType, userOnboardingGEM } from 'src/types/user.types';
import * as bs58 from 'bs58';
import { getNowUnix } from 'src/utils';

@Injectable()
export class AuthGuard implements CanActivate {
  private usersCollection: Collection<WithoutId<IUser>>;

  constructor(@Inject(MongoService) private mongoService: MongoService) {
    this.usersCollection = mongoService.db.collection('users');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    const appPubKey = req.headers['app-pub-key'];
    const publicAddress = req.headers['public-address'];

    if (!authHeader) {
      return false;
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      Logger.log('No token found', 'AuthGuard');

      return false;
    }
    try {
      // Get the JWK set used to sign the JWT issued by Web3Auth
      const jwks = createRemoteJWKSet(
        new URL(
          publicAddress
            ? 'https://authjs.web3auth.io/jwks'
            : 'https://api-auth.web3auth.io/jwks',
        ),
      ); // for social logins

      // Verify the JWT using Web3Auth's JWKS
      const jwtDecoded = await jwtVerify(token, jwks, {
        algorithms: ['ES256'],
      });
      const payload: any = jwtDecoded.payload;

      // social user
      if (
        appPubKey &&
        payload.wallets[0].public_key.toLowerCase() === appPubKey.toLowerCase()
      ) {
        const walletAddress = bs58.encode(
          Buffer.from(payload.wallets[0].public_key, 'hex'),
        );
        let user = await this.usersCollection.findOne({ walletAddress });
        if (!user) {
          const userData: WithoutId<IUser> = {
            walletAddress,
            type: 'social',
            email: payload.email,
            name: payload.name,
            profileImage: payload.profileImage,
            // lvl: 1,
            xp: 0,
            gem: userOnboardingGEM,
            gemEarned: 0,
            plan: {
              type: PlanType.free,
              startDate: getNowUnix(),
            },
            currentFreeMessages: 0,
            isAdmin: false,
            isActive: true,
          };
          const newUser = await this.usersCollection.insertOne(userData);

          user = {
            ...userData,
            _id: newUser.insertedId,
          };
        }

        req.user = user;

        if (!user.isActive) {
          return false;
        }

        return true;
      }

      // wallet user
      if (
        publicAddress &&
        payload.wallets[0].address.toLowerCase() === publicAddress.toLowerCase()
      ) {
        const walletAddress = publicAddress;
        let user = await this.usersCollection.findOne({ walletAddress });
        if (!user) {
          const userData: WithoutId<IUser> = {
            walletAddress,
            type: 'wallet',
            // lvl: 1,
            xp: 0,
            gem: userOnboardingGEM,
            gemEarned: 0,
            plan: {
              type: PlanType.free,
              startDate: getNowUnix(),
            },
            currentFreeMessages: 0,
            isAdmin: false,
            isActive: true,
          };
          const newUser = await this.usersCollection.insertOne(userData);

          user = {
            ...userData,
            _id: newUser.insertedId,
          };
        }

        req.user = user;

        if (!user.isActive) {
          return false;
        }

        return true;
      }
    } catch (e) {
      Logger.log('Invalid token: ' + e.message, 'AuthGuard');
      return false;
    }
    return false;
  }
}
