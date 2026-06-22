import type { StoryChoice } from "@/lib/story/story-types";
import styles from "./game-components.module.css";

type ChoicePanelProps = {
  choices: StoryChoice[];
  visible: boolean;
  onChoose: (choiceIndex: number) => void;
};

export function ChoicePanel({ choices, visible, onChoose }: ChoicePanelProps) {
  if (!visible) return null;

  return (
    <div className={styles.choices}>
      {choices.map((choice, index) => (
        <button
          className={styles.choice}
          key={choice.label}
          type="button"
          onClick={() => onChoose(index)}
        >
          {index + 1}. {choice.label}
        </button>
      ))}
    </div>
  );
}
