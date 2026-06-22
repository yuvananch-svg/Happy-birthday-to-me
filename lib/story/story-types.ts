export type MapPointKey =
  | "start"
  | "anniversaryJunction"
  | "anniversary"
  | "birthdayJunction"
  | "birthday"
  | "childhoodJunction"
  | "childhood"
  | "finalJunction"
  | "finalGate";

export type StoryNodeId =
  | "start"
  | "anniversary"
  | "birthday"
  | "childhood"
  | "funnyMemory"
  | "hardSeason"
  | "gift"
  | "letter"
  | "kidYears"
  | "growingUp"
  | "finalGate"
  | "sweetEnding"
  | "playfulEnding";

export type MemoryMedia =
  | {
      type: "image";
      src: string;
      alt: string;
      caption?: string;
    }
  | {
      type: "gallery";
      items: {
        src: string;
        alt: string;
        caption?: string;
      }[];
    }
  | {
      type: "video";
      src: string;
      caption?: string;
      poster?: string;
    };

export type StoryLine = {
  text: string;
  media?: MemoryMedia[];
};

export type StoryChoice = {
  label: string;
  next: StoryNodeId;
  journal?: string;
};

export type StoryReward = {
  type: "badge";
  id: string;
  label: string;
};

export type StoryNode = {
  id: StoryNodeId;
  speaker: string;
  chapter: string;
  destination: MapPointKey;
  lines: StoryLine[];
  choices: StoryChoice[];
  rewards?: StoryReward[];
};
