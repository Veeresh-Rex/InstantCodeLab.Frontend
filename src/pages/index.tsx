import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";
import { Divider } from "@heroui/divider";
import { Code as CodeIcon } from "lucide-react";

import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <span className={title()}>Share and run&nbsp;</span>
          <span className={title({ color: "blue" })}>code &nbsp;</span>
          <br />
          <span className={title()}>instantly with developers⚡</span>
          <div className={subtitle({ class: "mt-4" })}>
            Real-time coding sessions with code execution for interviews,
            lessons, and collaborative development
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            className={buttonStyles({
              color: "primary",
              radius: "full",
              size: "lg",
            })}
            href={"/new"}
          >
            <CodeIcon /> Start
          </Link>
        </div>
      </section>
      <Divider className="my-4" />
    </DefaultLayout>
  );
}
