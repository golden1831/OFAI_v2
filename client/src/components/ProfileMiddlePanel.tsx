import { Button, useBreakpoint, Heading, Text } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useWavesurfer } from "@wavesurfer/react";
import Vivaldi from "../assets/vivaldi_four_seasons.mp3";
import { useRef, useCallback } from "react";
import { IoPlayCircle, IoPauseCircle } from "react-icons/io5";
import { IoChatboxEllipses } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function ProfileMiddlePAnel(props: any) {
  const navigate = useNavigate();
  const Model = useSelector((state: any) => state.model.Model);
  const Models = useSelector((state: any) => state.models.Models);
  const containerRef = useRef<HTMLDivElement>(null);
  const profileImageDivRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const breakPoint = useBreakpoint();

  const { wavesurfer, isPlaying } = useWavesurfer({
    container: containerRef,
    waveColor: "grey",
    progressColor: "#d3d3d3",
    cursorWidth: 0,
    width: breakPoint === "lg" ? 160 : 230,
    barWidth: 3.5,
    barHeight: 0.5,
    barRadius: 3,
    barGap: 3.7,
    // url: Model?.voiceSampleUrl, // ! Model simple url
    url: Vivaldi, //! Test url
  });

  const onPlayPause = useCallback(() => {}, [wavesurfer]);

  const ScrollToView = () => {
    (props.BoxRef.current as HTMLDivElement | null)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className=" h-full flex justify-center flex-col px-[60px]">
      {/* Desktop View */}
      <div className="relative flex flex-col ">
        <div className="overflow-hidden h-[700px]" ref={profileImageDivRef}>
          
          <img
            // onError={() => setLoading(false)}
            src={Model?.image.url}
          />
          <div className="absolute -bottom-[10px] left-0 right-0 top-[75%] z-10 bg-gradient-to-t from-black via-black to-transparent" />
        </div>
        <div className=" z-10 absolute bottom-16 flex flex-col items-center w-full gap-5">
          <div className="flex flex-row items-center w-full  px-4">
            <div
              className="cursor-pointer"
              onClick={() => {
                onPlayPause();
              }}
            >
              {!isPlaying ? (
                <IoPlayCircle size={50} />
              ) : (
                <IoPauseCircle size={50} />
              )}
            </div>
            <div className="flex aspect-[212/26] max-w-[290px] transition-opacity duration-200 group-hover:opacity-85 ">
              <div
                className="flex py-1 aspect-[212/26] relative bottom-14 max-w-[290px] transition-opacity"
                ref={containerRef}
              ></div>
            </div>
            <div className="absolute right-0">
              <Button
                className="border-[#FF00BF] border-[1px] inline-block max-w-fit p-6 ml-2"
                colorScheme="black"
                rounded={"xl"}
                size={breakPoint === "lg" ? "sm" : "md"}
                onClick={() => navigate(`/chat/${Model?.username}`)}
              >
                <IoChatboxEllipses className="mr-2" color="#FF00BF" size={23} />
                Chat Now
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full px-4 z-10 ">
        <div className="z-20">
          <Heading
            size={breakPoint === "lg" ? "lg" : "2xl"}
            fontWeight={"normal"}
            pb={5}
          >
            {Model?.firstName}
          </Heading>
          <Text pb={10}>{Model?.shortBio}</Text>
          <Heading fontWeight={"normal"} size={"lg"} pb={5}>
            Bio
          </Heading>
          <Text pb={10}>{Model?.longBio}</Text>
        </div>
      </div>
      <div className="">
        <Heading
          size={breakPoint === "lg" ? "lg" : "xl"}
          pb={5}
          fontWeight={"normal"}
          className="flex justify-center items-center"
        >
          More like {Model?.firstName}
        </Heading>
        <div className="grid grid-cols-2 rounded-lg gap-2.5 sm:gap-2 lg:gap-3.5 overflow-hidden">
          {Models.map((model: any, index: number) => (
            <div
              ref={imageRef}
              key={index}
              className="relative aspect-[4/5] cursor-pointer"
              onClick={() => {
                navigate(`/${model?.username}`), ScrollToView();
              }}
            >
                <img
                loading="lazy"
                // onError={() => setLoadingProf(false)}
                src={model?.imageUrl}
                alt="model"
                
                className="image duration-700 relative opacity-1 rounded-lg object-cover"
                style={{
                  position: "absolute",
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                }}
                />
              {/* )} */}
              <div className="absolute inset-0 bg-neutral-2 -z-10 " />
              <div className="absolute inset-0 -bottom-[1px] top-16 bg-gradient-to-b from-transparent via-black/20 to-black transition-all duration-150 group-hover:top-40" />
              <div className="absolute inset-0 flex flex-col items-start justify-end px-2.5 py-4">
                <div className="relative">
                  <p className="pb-0.5 pl-1 font-extralight text-lg">
                    {model?.firstName}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
