import { Injectable } from '@nestjs/common';
import { Civitai, Scheduler } from 'civitai';

@Injectable()
export class CivitaiService {
  private civitai: Civitai;

  constructor() {
    this.civitai = new Civitai({
      auth: process.env.CIVITAI_API_KEY,
    });
  }

  async text2Img(prompt: string) {
    const input = {
      model: 'urn:air:sd1:checkpoint:civitai:81458@132760',
      params: {
        prompt: `
					Ethnicity: Latino
					Nationality: Venezuelan
					Eye Color: Brown
					Hair Color: Black
					Hair Style: Long wavy
					Body Type: Normal
					Breast Size: Medium
        	Butt Size: Medium
					
					${prompt.replaceAll('send', '').replaceAll('me', '').replace('a ', '').replaceAll('pic', '').replace('of', '')}
				`,
        negativePrompt:
          'text, cartoon, painting, illustration, (worst quality, low quality, normal quality:2),deformed body, deformed face, mutated arms, mutated legs, mutated fingers, merged bodies, merged hands, more l than two feet, distorted feet, more than five toes per foot, less than five toes per foot, converged feet, switching left foot and right foot, merged feet, merged hands, more than five fingers per hand, less than five fingers per hand',
        scheduler: Scheduler.DPM2MKARRAS,
        steps: 20,
        cfgScale: 7,
        width: 512,
        height: 768,
        clipSkip: 2,
        seed: 1234567890,
      },
      quantity: 1,
    };

    const response = await this.civitai.image.fromText(input, true);

		return response.jobs[0].result.jobs[0].result.blobUrl
  }
}
