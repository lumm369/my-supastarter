import styles from "./page.module.css";
import { Button } from "@ui/components/button";

export default function Home() {
  return (
    <div className={styles.page}>
      <h1>Welcome to my website!</h1>
      <Button>click me</Button>
    </div>
  );
}
