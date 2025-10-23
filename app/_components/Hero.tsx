import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { Plane, Send, Globe2, Landmark } from "lucide-react";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";

const suggestions = [
  {
    title: "create new trip",
    icon: <Globe2 className="text-blue-400 h-5 w-5 hover:text-white" />,
  },
  {
    title: "create new trip",
    icon: <Plane className="text-green-500 h-5 w-5 hover:text-white" />,
  },
  {
    title: "create new trip",
    icon: <Landmark className="text-orange-500 h-5 w-5 hover:text-white" />,
  },
  {
    title: "create new trip",
    icon: <Globe2 className="text-yellow-600 h-5 w-5 hover:text-white" />,
  },
];

function Hero() {
  return (
    <div className="mt-24 flex items-center justify-center">
      {/* Content */}
      <div className="max-w-3xl w-full text-center space-y-6">
        <h1 className="text-xl md:text-5xl font-bold">
          Hey, I'm your personal{" "}
          <span className="text-orange-600">trip planner</span>
        </h1>
        <p className="text-lg">
          tell me what all you want i will handle th rest: hotels flights- all
          in seconds
        </p>

        {/* Input Box */}
        <div>
          <div className="border rounded-2xl p-4 relative">
            <Textarea
              placeholder="create a trip from paris to newyork"
              className="w-full h-28 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none"
            />
            <Button size={"icon"} className="absolute bottom-6 right-6">
              <Send className="h-4 w-4  " />
            </Button>
          </div>

          {/* Suggestion List */}

          <div className="flex gap-5">
            {suggestions.map((suggestions, index) => (
              <div
                key={index}
                className="flex items-center gap-2 border rounded-full p-2 cursor-pointer hover:bg-amber-600 hover:text-white"
              >
                {suggestions.icon}
                <h2 className="text-sm">{suggestions.title}</h2>
              </div>
            ))}
          </div>

          {/* Video Section */}

          <HeroVideoDialog
            className="block dark:hidden"
            animationStyle="from-center"
            videoSrc="https://www.youtube.com/embed/3SsK-cxlj_w?autoplay=1&start=23"
            thumbnailSrc="https://mma.prnewswire.com/media/2401528/1_MindtripProduct.jpg?p=facebook"
            thumbnailAlt="Dummy Video Thumbnail"
          />
        </div>
      </div>
    </div>
  );
}

export default Hero;
