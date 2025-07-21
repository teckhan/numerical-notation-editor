import React from "react";
import LeftInfoBlock from "./LeftInfoBlock";
import RightInfoBlock from "./RightInfoBlock";
import Title from "./Title";
import Subtitle from "./Subtitle";

function Header() {
  return (
    <>
      <Title></Title>
      <Subtitle></Subtitle>
      <LeftInfoBlock></LeftInfoBlock>
      <RightInfoBlock></RightInfoBlock>
    </>
  );
}

export default React.memo(Header);
