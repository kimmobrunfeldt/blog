import React from "react";

const blobDimensions = {
  width: 505,
  height: 516,
};
const BlobSvg = (
  <svg
    width={blobDimensions.width}
    height={blobDimensions.height}
    viewBox="0 0 505 516"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M86.0902 325.05C73.3603 296.406 68.9369 263 72.0321 227.858C75.1273 192.716 85.9606 156.26 107.985 127.958C130.056 99.9607 163.491 80.2355 196.906 75.8334C230.148 71.3135 263.15 81.6936 294.359 93.5935C325.395 105.375 354.591 118.372 378.578 140.152C402.565 161.932 421.47 192.309 429.143 227.649C436.988 263.106 433.428 303.41 414.571 334.139C395.714 364.867 361.515 385.717 327.779 405.511C294.217 425.424 261.072 443.977 230.1 442.919C199.128 441.861 170.155 421.074 145.047 399.08C120.065 376.897 98.9475 353.507 86.0902 325.05Z"
      fill="#BE8D6A"
      fillOpacity="0.22"
    />
  </svg>
);

const BlobSvg2 = (
  <svg
    width="0"
    height="0"
    viewBox="0 0 363 324"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <clipPath id="blob">
        <path
          d="M271.754 28.3563C297.889 43.683 319.908 66.9881 336.783 95.542C353.658 124.096 364.976 157.689 362.712 190.862C360.243 223.825 343.986 256.368 319.291 277.153C294.802 297.939 262.288 307.177 230.391 314.316C198.7 321.454 167.832 326.703 136.346 322.504C104.861 318.305 72.7582 304.868 47.0348 281.772C21.1056 258.677 1.76162 225.924 0.115319 192.541C-1.53098 159.158 14.7262 125.356 31.1892 92.6026C47.4463 59.8496 64.1151 28.3563 89.8385 13.0296C115.562 -2.29719 150.546 -1.45736 183.06 2.32183C215.574 6.31099 245.619 13.2395 271.754 28.3563Z"
          fill="#BE8D6A"
        />
      </clipPath>
    </defs>
  </svg>
);

type Props = {
  className?: string;
};

export const FloatingProfilePicture = (props: Props) => (
  <div className={`relative floating-profile-picture ${props.className}`}>
    <div
      className="tk-blob absolute animated-blob-container"
      style={
        {
          ...blobDimensions,
          "--time": "50s",
          "--amount": 1,
          "--fill": "#BE8D6A",
        } as React.CSSProperties
      }
    >
      {BlobSvg}
    </div>

    <div className="absolute">
      <div
        className="tk-blob absolute"
        style={
          {
            ...blobDimensions,
            "--time": "40s",
            "--amount": 0.5,
            "--fill": "none",
          } as React.CSSProperties
        }
      >
        {BlobSvg2}
      </div>
      <img
        alt="Kimmo's picture"
        className="blob-mask relative profile-image-position"
        src="kimmo.jpg"
      />
    </div>

    <div className="map-location-line" />
    <div className="floating-map-container-layer-2" />
    <div className="floating-map-container-layer-1" />

    <div className="floating-map-container">
      <img alt="Map of Helsinki" src="map-light.jpg" />
      <div className="colorizer" />
    </div>
  </div>
);
