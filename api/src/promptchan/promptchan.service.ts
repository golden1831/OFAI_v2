import { Injectable } from '@nestjs/common';

@Injectable()
export class PromptchanService {
  private imgApiUrl = 'https://api.promptchan.ai';
  private txtApiUrl = 'https://dev.promptchan.ai';

  async getBase64ImageFromUrl(imageUrl: string): Promise<string> {
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer).toString('base64');
  }

  async img2Img(imageUrl: string, prompt: string): Promise<string> {
    try {
      console.log('imageUrl ===>', imageUrl);
      const character_image = await this.getBase64ImageFromUrl(imageUrl);
      console.log('character image converted to base64');
      
      const res = await fetch(`${this.imgApiUrl}/api/external/create`, {
        headers: {
          'x-api-key': process.env.PROMPTCHAN_X_API_KEY,
          'Content-Type': 'application/json',
        },
        method: 'post',
        body: JSON.stringify({
          style: 'Real',
          // style: 'Cinematic XL',
          filter: 'Default',
          detail: 0,
          prompt: `${prompt}`,
          seed: -1,
          quality: 'Max',
          creativity: 50,
          image_size: '512x768',
          negative_prompt:
            'deformed body, deformed face, mutated arms, mutated legs, mutated fingers, merged bodies, merged hands, more l than two feet, distorted feet, more than five toes per foot, less than five toes per foot, converged feet, switching left foot and right foot, merged feet, merged hands, more than five fingers per hand, less than five fingers per hand, 6 fingers, 6 toes, 3 hands, 3 feet',
          restore_faces: true,
          character_image,
        }),
      });

      console.log(res.ok);

      if (!res.ok) return null;

      const data = await res.json();
      console.log('gems ===>', data.gems);
      return data.image;
    } catch (error) {
      console.log('PromptchainService generateImage error ==>', error);
      return null;
    }
  }

  async text2Img(prompt: string): Promise<string> {
    try {
      const res = await fetch(`${this.txtApiUrl}/api/external/create`, {
        headers: {
          'x-api-key': process.env.PROMPTCHAN_X_API_KEY,
          'Content-Type': 'application/json',
        },
        method: 'post',
        body: JSON.stringify({
          style: 'Real',
          // style: 'Cinematic XL',
          filter: 'Default',
          detail: 0,
          prompt: `Ethnicity: Latino, Nationality: Venezuelan, Eye Color: Brown, Hair Color: Black, Hair Style: Long wavy, Body Type: Normal, Breast Size: Very large, Butt Size: Very large, ${prompt}, very sexy realistic look with full body`,
          seed: 1234567890,
          quality: 'Max',
          creativity: 50,
          image_size: '512x768',
          negative_prompt:
            'deformed body, deformed face, mutated arms, mutated legs, mutated fingers, merged bodies, merged hands, more l than two feet, distorted feet, more than five toes per foot, less than five toes per foot, converged feet, switching left foot and right foot, merged feet, merged hands, more than five fingers per hand, less than five fingers per hand',
        }),
      });

      console.log(res.ok);

      if (!res.ok) return null;

      const data = await res.json();
      console.log('gems ===>', data.gems);
      return data.image;
    } catch (error) {
      console.log('PromptchainService generateImage error ==>', error);
      return null;
    }
  }
}
