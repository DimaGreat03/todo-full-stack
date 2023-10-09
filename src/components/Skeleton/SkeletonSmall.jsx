import React from "react";
import ContentLoader from "react-content-loader";
import s from "./skeleton.module.css"

const SmallSkeleton = (props) => (
  <ContentLoader
    className={s.skeleton}
    speed={1}
    width={2000}
    height={200}
    viewBox="0 0 2000 200"
    backgroundColor="#787878"
    foregroundColor="#ffffff"
    {...props}
  >
    <rect x="40" y="11" rx="3" ry="3" width="509" height="21" /> 
    <rect x="41" y="56" rx="3" ry="3" width="397" height="20" />
    <rect x="44" y="102" rx="3" ry="3" width="438" height="21" />
    <rect x="6" y="11" rx="0" ry="0" width="22" height="21" />
    <rect x="5" y="55" rx="0" ry="0" width="22" height="21" />
    <rect x="6" y="149" rx="0" ry="0" width="22" height="21" />
    <rect x="5" y="101" rx="0" ry="0" width="22" height="21" />
    <rect x="42" y="148" rx="3" ry="3" width="509" height="21" />
  </ContentLoader>
);

export default SmallSkeleton;
