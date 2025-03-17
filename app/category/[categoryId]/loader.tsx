import React from "react";

function loader() {
  return (
    <div>
      <div className="loader">
        <svg
          version="1.1"
          id="L9"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 100 100"
          enableBackground="new 0 0 0 0"
          xmlSpace="preserve"
        >
          <path
            fill="#000"
            d="M73.2,50c0-12.8-10.4-23.2-23.2-23.2S26.8,37.2,26.8,50H10c0-22.1,17.9-40,40-40s40,17.9,40,40H73.2z"
          >
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="rotate"
              dur="1s"
              from="0 50 50"
              to="360 50 50"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>
    </div>
  );
}

export default loader;
