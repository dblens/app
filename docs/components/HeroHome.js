import React, { useState } from "react";
import Modal from "../utils/Modal";

const DownloadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    className="pr-2 feather feather-download-cloud"
  >
    <polyline points="8 17 12 21 16 17"></polyline>
    <line x1="12" y1="12" x2="12" y2="21"></line>
    <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"></path>
  </svg>
);

function HeroHome() {
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  return (
    <section className="relative">
      {/* Illustration behind hero content */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 bottom-0 pointer-events-none"
        aria-hidden="true"
      >
        <svg
          width="1360"
          height="578"
          viewBox="0 0 1360 578"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              x1="50%"
              y1="0%"
              x2="50%"
              y2="100%"
              id="illustration-01"
            >
              <stop stopColor="#FFF" offset="0%" />
              <stop stopColor="#EAEAEA" offset="77.402%" />
              <stop stopColor="#DFDFDF" offset="100%" />
            </linearGradient>
          </defs>
          <g fill="url(#illustration-01)" fillRule="evenodd">
            <circle cx="1232" cy="128" r="128" />
            <circle cx="155" cy="443" r="64" />
          </g>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Hero content */}
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">
          {/* Section header */}
          <div className="text-center pb-12 md:pb-16">
            <h1
              className="text-4xl md:text-5xl font-extrabold leading-tighter tracking-tighter mb-4"
              data-aos="zoom-y-out"
            >
              Modern <span className="text-blue-600">PostgreSQL</span> explorer{" "}
              <br />
              simplified for everyone
              {/* <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">DB Lens</span> */}
            </h1>
            <div className="max-w-3xl mx-auto">
              <p
                className="text-lg text-gray-600 mb-4"
                data-aos="zoom-y-out"
                data-aos-delay="150"
              >
                Explore data, visualise entity relations & database performance
                metrics and <br /> analyse disk usage from PostgreSQL
              </p>
              <p
                className="text-xs text-gray-600"
                data-aos="zoom-y-out"
                data-aos-delay="150"
              >
                Quickstart with:
              </p>
              <div
                className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center pt-2"
                data-aos="zoom-y-out"
                data-aos-delay="300"
              >
                <div className="bg-gray-900 text-white p-4 rounded-lg shadow-lg text-sm flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 11c.45 0 .883.18 1.207.503.324.324.503.756.503 1.207s-.18.883-.503 1.207c-.324.324-.756.503-1.207.503s-.883-.18-1.207-.503A1.702 1.702 0 0110 12.71c0-.451.18-.883.503-1.207.324-.324.756-.503 1.207-.503zm0 0V7m0 10h0"
                    />
                  </svg>
                  <code>npx dblens &lt;connection_string&gt;</code>
                </div>
                <a
                  href="/docs/quickstart"
                  className=" mx-2 btn text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded shadow-lg"
                >
                  → Read Docs
                </a>
              </div>
              <div
                className="mt-4"
                data-aos="zoom-y-out"
                data-aos-delay="300"
              ></div>
              {/* <div
      className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center pt-2"
      data-aos="zoom-y-out"
      data-aos-delay="300"
    >
      <div>
        <a
          className="btn text-white bg-blue-600 hover:bg-blue-700 w-full mb-4 sm:w-auto sm:mb-0 ml-2"
          href="https://github.com/dblens/app/releases/download/v0.0.1-beta.2/DB-Lens-0.0.1-beta.2.dmg"
        >
          <DownloadIcon />
          Mac
        </a>
        <a
          className="btn text-blue-600 border border-blue-600 hover:bg-blue-100 w-full mb-4 sm:w-auto sm:mb-0 ml-2"
          href="https://github.com/dblens/app/releases/download/v0.0.1-beta.2/DB-Lens-Setup-0.0.1-beta.2.exe"
        >
          <DownloadIcon />
          Windows
        </a>
        <a
          className="btn text-white bg-blue-600 hover:bg-blue-700 w-full mb-4 sm:w-auto sm:mb-0 ml-2"
          href="https://github.com/dblens/app/releases/download/v0.0.1-beta.2/DB-Lens-0.0.1-beta.2.AppImage"
        >
          <DownloadIcon />
          Linux
        </a>
      </div>
    </div> */}
            </div>
          </div>

          {/* Hero image */}
          <div>
            <div
              className="relative flex justify-center mb-8"
              data-aos="zoom-y-out"
              data-aos-delay="450"
            >
              <div className="flex flex-col justify-center">
                <img
                  className="mx-auto"
                  src="./images/hero-image.png"
                  width="768"
                  height="432"
                  alt="Hero"
                />
                {/* <svg
                  className="absolute inset-0 max-w-full mx-auto md:max-w-none h-auto"
                  width="768"
                  height="432"
                  viewBox="0 0 768 432"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                  <defs>
                    <linearGradient
                      x1="50%"
                      y1="0%"
                      x2="50%"
                      y2="100%"
                      id="hero-ill-a"
                    >
                      <stop stopColor="#FFF" offset="0%" />
                      <stop stopColor="#EAEAEA" offset="77.402%" />
                      <stop stopColor="#DFDFDF" offset="100%" />
                    </linearGradient>
                    <linearGradient
                      x1="50%"
                      y1="0%"
                      x2="50%"
                      y2="99.24%"
                      id="hero-ill-b"
                    >
                      <stop stopColor="#FFF" offset="0%" />
                      <stop stopColor="#EAEAEA" offset="48.57%" />
                      <stop stopColor="#DFDFDF" stopOpacity="0" offset="100%" />
                    </linearGradient>
                    <radialGradient
                      cx="21.152%"
                      cy="86.063%"
                      fx="21.152%"
                      fy="86.063%"
                      r="79.941%"
                      id="hero-ill-e"
                    >
                      <stop stopColor="#4FD1C5" offset="0%" />
                      <stop stopColor="#81E6D9" offset="25.871%" />
                      <stop stopColor="#338CF5" offset="100%" />
                    </radialGradient>
                    <circle id="hero-ill-d" cx="384" cy="216" r="64" />
                  </defs>
                  <g fill="none" fillRule="evenodd">
                    <circle
                      fillOpacity=".04"
                      fill="url(#hero-ill-a)"
                      cx="384"
                      cy="216"
                      r="128"
                    />
                    <circle
                      fillOpacity=".16"
                      fill="url(#hero-ill-b)"
                      cx="384"
                      cy="216"
                      r="96"
                    />
                    <g fillRule="nonzero">
                      <use fill="#000" xlinkHref="#hero-ill-d" />
                      <use fill="url(#hero-ill-e)" xlinkHref="#hero-ill-d" />
                    </g>
                  </g>
                </svg> */}
              </div>
              <button
                className="absolute top-full flex items-center transform -translate-y-1/2 bg-white rounded-full font-medium group p-4 shadow-lg"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setVideoModalOpen(true);
                }}
                aria-controls="modal"
              >
                <svg
                  className="w-6 h-6 fill-current text-gray-400 group-hover:text-blue-600 flex-shrink-0"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0 2C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12z" />
                  <path d="M10 17l6-5-6-5z" />
                </svg>
                <span className="ml-3">Watch the video</span>
              </button>
            </div>

            {/* Modal */}
            <Modal
              id="modal"
              ariaLabel="modal-headline"
              show={videoModalOpen}
              handleClose={() => setVideoModalOpen(false)}
            >
              <div className="relative pb-9/16">
                <DbLensDemo />
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroHome;

const DbLensDemo = () => {
  return (
    <div style={{ padding: "64.65% 0 0 0", position: "relative" }}>
      <iframe
        src="https://player.vimeo.com/video/978356790?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        title="DB Lens Demo"
      ></iframe>
    </div>
  );
};
