import { redirect } from "next/navigation";

// B won ("B carries more weight" — Tony). The variant IS the homepage now;
// this route survives only so shared /home-b links keep working.
export default function HomeB() {
  redirect("/");
}
