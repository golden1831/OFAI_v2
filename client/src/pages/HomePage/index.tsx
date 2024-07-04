import { useEffect, useState } from 'react';
import ExploreMiddlePanel from '../../components/ExploreMiddlePanel';
import { fireIcon, onlyFansIcon, starIcon, twinkleIcon } from '../../assets/icons';
import { pinkFireIcon, pinkOnlyFansIcon, pinkStarIcon, pinkTwinkleIcon } from '../../assets/icons/pink';
import Footer from '../../components/Footer';
import { shuffleArray } from '../../lib/utils';
import { clsx } from 'clsx';
import { ICompanion } from '../../types/Companion.types';
import { useGetCompanionsQuery } from '../../Navigation/redux/apis/companionApi';
import Slider from './slider';

enum FilterType {
  All,
  Trending,
  OnlyFans,
  AIGirlfriend,
}

const actions = [
  {
    type: FilterType.All,
    name: 'All',
    icon: starIcon,
    checkedIcon: pinkStarIcon,
  },
  {
    type: FilterType.Trending,
    name: 'Trending',
    icon: fireIcon,
    checkedIcon: pinkFireIcon,
  },
  {
    type: FilterType.OnlyFans,
    name: 'OnlyFans',
    icon: onlyFansIcon,
    checkedIcon: pinkOnlyFansIcon,
  },
  {
    type: FilterType.AIGirlfriend,
    name: 'AIGirlfriend',
    icon: twinkleIcon,
    checkedIcon: pinkTwinkleIcon,
  },
];

function HomePage() {
  const [filterType, setFilterType] = useState(FilterType.All);
  const [filteredModels, setFilteredModels] = useState<ICompanion[]>([]);

  const { data } = useGetCompanionsQuery();

  useEffect(() => {
    if (!data) return;

    function sortModels(models: ICompanion[]) {
      const reorder = models.slice().sort((a, b) => b.totalMsg - a.totalMsg);

      return reorder;
    }

    switch (filterType) {
      case FilterType.All:
        setFilteredModels(shuffleArray(data));
        break;

      case FilterType.Trending:
        setFilteredModels(sortModels(data));
        break;

      case FilterType.OnlyFans:
        setFilteredModels(sortModels(data.filter((model) => !model.isAiGirl)));
        break;

      case FilterType.AIGirlfriend:
        setFilteredModels(sortModels(data.filter((model) => model.isAiGirl)));
        break;

      default:
        setFilteredModels(data);
        break;
    }
  }, [data, filterType]);

  return (
    <div className="flex flex-col size-full">
      <Slider />

      <div className="flex flex-col gap-4 md:flex-row justify-between px-6 pt-4 pb-2">
        <h1 className="pl-4 text-2xl font-semibold w-full md:w-auto text-center whitespace-nowrap">
          Pick A Girl & Start Chatting
        </h1>

        <div className="flex gap-x-2 overflow-x-auto hide-scrollbar">
          {actions.map((action) => (
            <button
              key={action.name}
              onClick={() => setFilterType(action.type)}
              className={clsx(
                'inline-flex justify-center items-center gap-2 py-1 px-6 border rounded-xl h-9 whitespace-nowrap',
                filterType === action.type
                  ? 'border-primary-500 text-primary-500 bg-primary-500/20'
                  : 'bg-white/5 border-white/10'
              )}
            >
              <img src={filterType === action.type ? action.checkedIcon : action.icon} className="h-4" />

              {action.name}
            </button>
          ))}
        </div>
      </div>

      <ExploreMiddlePanel Models={filteredModels} />

      <Footer isScrolling={false} />
    </div>
  );
}

export default HomePage;
