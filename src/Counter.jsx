import { Label } from "semantic-ui-react";
import styles from "./counter.module.scss";

export default function Counter({ amountLoaded }) {
  return (
    <div className={styles.counter}>
      <Label size="tiny">
        Loaded rows:
        <Label.Detail>{`${amountLoaded}/100`}</Label.Detail>
      </Label>
    </div>
  );
}
