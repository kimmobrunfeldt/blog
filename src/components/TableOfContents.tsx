import React from "react";
import { Header } from "src/types/siteData";
import { Link } from ".";

type Props = {
  headers: Header[];
};

const levelClasses: { [key: number]: string } = {
  2: "pl-[0px]",
  3: "pl-[10px]",
  4: "pl-[20px]",
};

export const TableOfContents = ({ headers }: Props) => {
  const showHeaders = headers.filter((h) => h.level <= 4);
  return (
    <nav>
      <ol>
        {showHeaders.map((header) => (
          <li key={header.id} className={levelClasses[header.level]}>
            <Link className="text-xs" color="none" href={`#${header.id}`}>
              {header.text}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
};
