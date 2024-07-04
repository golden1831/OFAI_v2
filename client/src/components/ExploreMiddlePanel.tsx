import { useDispatch } from 'react-redux';
import { setModel } from '../Navigation/redux/slice/ModelSlice';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from './LoadingSpinner';
import { ICompanion } from '../types/Companion.types';
import { chatIcon } from '../assets/icons';

function ExploreMiddlePanel({ Models }: { Models: ICompanion[] }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (Models.length <= 0) {
    return (
      <div className="size-full flex justify-center items-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-6 z-1">
      {Models.map((model) => (
        <div
          key={model._id}
          className="relative aspect-[4/5] rounded-lg overflow-hidden cursor-pointer transition duration-200 ease-in-out group hover:transform hover:scale-105 z-1"
          onClick={() => {
            dispatch(setModel(model));
            navigate(`/${model.username}`);
          }}
        >
          <div className="absolute top-2 text-xs right-2 flex items-center gap-1 rounded-lg px-2 py-1 bg-black/60">
            <img src={chatIcon} alt="" className="size-3" />

            {`${(model.totalMsg / 1000).toFixed(2)}K`}
          </div>

          {model.image?.url && <img src={model.image.url} alt="model" className="size-full object-cover" />}

          <div className="absolute inset-0 -bottom-px top-12 bg-gradient-to-b from-transparent via-black/70 to-black transition-all duration-150 group-hover:top-40" />
          <div className="absolute inset-0 flex flex-col items-start justify-end px-2.5 py-4">
            <div className="relative flex flex-col transition-all duration-300 w-full bottom-0 group-hover:bottom-2">
              <p className="font-semibold text-lg transitiona-all duration-300">
                {model.firstName}, {model.age}
              </p>

              <p className="text-sm text-white/60 pointer-events-none w-full relative transitiona-all duration-300 line-clamp-3 md:line-clamp-2">
                {model.shortBio}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ExploreMiddlePanel;
