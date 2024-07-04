import MetalSilver from "../assets/icons/leaderboard/metal-silver.svg";
import MetalGold from "../assets/icons/leaderboard/metal-gold.svg";
import MetalBronze from "../assets/icons/leaderboard/metal-bronze.svg";
import { pinkGemIcon } from '../assets/icons/pink';
import { clsx } from 'clsx';
import Footer from '../components/Footer';
import { useGetTopThreeUsersQuery, useLeaderBoardQuery } from '../Navigation/redux/apis/userApi';
import { useMemo, useState } from 'react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { getProfileLvl } from '../types/user.types';
import { profileAvatar } from '../lib/getProfileAvatar';
import Paginate from "../components/Pagination";

const medals = [
  {
    medal: MetalSilver,
    className: "order-2 md:order-1",
    background: "linear-gradient(0deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08)), radial-gradient(65.4% 100% at 50% 0%, rgba(228, 228, 228, 0.2) 0%, rgba(228, 228, 228, 0) 71.59%)"
  },
  {
    medal: MetalGold,
    className: "order-1 md:order-2 col-span-2",
    background: "linear-gradient(0deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08)), radial-gradient(58.97% 101.75% at 50% 0%, rgba(255, 180, 0, 0.192) 0%, rgba(255, 180, 0, 0.048) 69.67%, rgba(255, 180, 0, 0) 100%)"
  },
  {
    medal: MetalBronze,
    className: "order-3",
    background: "linear-gradient(0deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08)), radial-gradient(67.15% 79.94% at 50% 0%, rgba(167, 81, 65, 0.28) 0%, rgba(181, 110, 63, 0) 100%)"
  },
]

export default function LeaderboardPage() {
  const [page, setPage] = useState(1);

  const { data: leaderBoard } = useLeaderBoardQuery({ page: page - 1, limit: 10 });
  const { data: topThreeUsers } = useGetTopThreeUsersQuery();

  const sortTopThreeUsers = useMemo(() => {
    if (topThreeUsers) {
      const top1User = topThreeUsers[0];
      const top2User = topThreeUsers[1];
      const top3User = topThreeUsers[2];

      return [
        top2User,
        top1User,
        top3User,
      ]
    }

    return []
  }, [topThreeUsers])

  if (!leaderBoard || !topThreeUsers) {
    return (
      <div className="size-full flex justify-center items-center">
        <LoadingSpinner />
      </div>
    )
  }

	return (
		<div className="flex flex-col w-full max-w-4xl mx-auto mt-14 mb-24 px-6">
      <div className="w-full gap-y-10 gap-x-4 items-center grid grid-cols-2 md:flex md:gap-5">
        {sortTopThreeUsers.map(({ _id, xp, name, profileImage }, index) => {
          const lvl = getProfileLvl(xp)

          const { medal, className, background } = medals[index]

          return (
            <div 
              key={_id}
              style={{ background }}
              className={clsx(
                "flex flex-1 flex-col items-center rounded-lg relative border border-solid border-white/10", 
                index === 1 ? "py-8 px-12" : "p-8",
                className
              )}
            >
              <div className="flex flex-col items-center absolute -top-8 md:-top-10">
                <img 
                  src={profileAvatar(profileImage)} 
                  alt="" 
                  className={clsx(
                    "aspect-square object-cover rounded-full",
                    index === 1 ? "size-20 md:size-28" : "size-16 md:size-24"
                  )} 
                />
  
                <p className="absolute border border-solid border-white/10 bg-black/30 backdrop-blur-md text-white rounded-full text-xs text-center py-0.5 px-2 text-nowrap -bottom-3 md:py-1 md:-bottom-2">
                  {xp} XP
                </p>
              </div>
  
              <h2 
                className={clsx(
                  "font-semibold text-white text-center mb-1 md:mt-12 md:mb-2",
                  index === 1 ? "text-3xl mt-10 md:text-4xl" : "text-lg mt-6 md:text-3xl"
                )}
              >
                {name}
              </h2>
              <p className="text-white text-center font-medium">LVL {lvl}</p>
  
              <img 
                src={medal} 
                alt="" 
                className={clsx(
                  "absolute",
                  index === 1 ? "top-4 right-4 size-10 md:size-11" : "size-8 top-2 right-2 md:size-11 md:top-4 md:right-4"
                )}
              />
            </div>
          )
        })}
      </div>

      <table 
        style={{
          boxShadow: "0 0 0 1px #FFFFFF2A"
        }}
        className="border-collapse mt-5 w-full bg-white/5 rounded-2xl"
      >
        <thead>
          <tr>
            {["Rank", "Username", "Level", "Total XP", "Gems Earned"].map((title, index) => (
              <th 
                key={title} 
                className={clsx(
                  "py-4 text-white/60 font-normal text-left", 
                  index === 0 ? "px-4" : "px-6",
                  index > 2 && "max-sm:hidden",
                )}
              >
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-white">
          {leaderBoard.rows.map(({ _id, xp, name, gemEarned, profileImage }, index) => (
            <tr 
              key={_id} 
              className="border-t border-solid border-t-white/5"
            >
              <td className="px-4 py-2">
                <p
                  style={{
                    background: "linear-gradient(90deg, #BB38DC 0%, #FF00BF 100%)"
                  }}
                  className="rounded-lg p-1.5 w-fit"
                >
                  #{index + 4}
                </p>
              </td>
              <td className="px-6 py-2">
                <div className="flex gap-3 items-center">
                  <img src={profileAvatar(profileImage)} alt="" className="size-11 aspect-square object-cover rounded-full" />
                  <p>{name}</p>
                </div>
              </td>
              <td className="px-6 py-2">{getProfileLvl(xp)}</td>
              <td className="px-6 py-2 max-sm:hidden">{xp}</td>
              <td className="px-6 py-2 max-sm:hidden">
                <div className="flex gap-2 items-center">
                  <p>{gemEarned}</p>
                  <img src={pinkGemIcon} alt="" className="size-5 aspect-square" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Paginate 
        total={leaderBoard.total}
        pages={Math.ceil(leaderBoard.total / leaderBoard.rows.length)}
        perPage={10}
        className="mt-10"
        currentPage={page}
        onPaginate={setPage}
      />

      <Footer />
		</div>
	);
}   