import React from "react";
import logo from "../public/images/favicon.png";

function Footer() {
  return (
    <footer>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top area: Blocks */}
        <div className="grid sm:grid-cols-10 gap-8 py-8 md:py-12 border-t border-gray-200">
          {/* 1st block */}
          <div className="sm:col-span-12 lg:col-span-3">
            <div className="mb-2">
              {/* Logo */}
              {/* <Link to="/" className="inline-block" aria-label="DB Lens"> */}
              <img alt="logo" height={50} width={50} src={logo} />
              {/* </Link> */}
            </div>
            {/* <div className="text-sm text-gray-600">
              <Link
                to="#"
                className="text-gray-600 hover:text-gray-900 hover:underline transition duration-150 ease-in-out"
              >
                Terms
              </Link>{" "}
              ·{" "}
              <Link
                to="#"
                className="text-gray-600 hover:text-gray-900 hover:underline transition duration-150 ease-in-out"
              >
                Privacy Policy
              </Link>
            </div> */}
          </div>
          <div className="sm:col-span-6 md:col-span-3 lg:col-span-2"></div>
          <div className="sm:col-span-6 md:col-span-3 lg:col-span-2"></div>

          {/* 2nd block */}
          <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h6 className="text-gray-800 font-medium mb-2">Resources</h6>
            <ul className="text-sm">
              <li className="mb-2">
                <a
                  href="https://discord.com/invite/PZT4C5mk"
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
                >
                  Discord
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="https://github.com/dblens/app"
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
                >
                  Github
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="https://twitter.com/db_lens"
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
                >
                  Twitter
                </a>
              </li>
              {/* <li className="mb-2">
                <Link
                  to="#"
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
                >
                  Integrations
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
                >
                  Command-line
                </Link> 
              </li> */}
            </ul>
          </div>

          {/* 3rd block */}
          {/* <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h6 className="text-gray-800 font-medium mb-2">Resources</h6>
            <ul className="text-sm">
              <li className="mb-2">
                <Link
                  to="#"
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
                >
                  Documentation
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
                >
                  Tutorials & Guides
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
                >
                  Blog
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
                >
                  Support Center
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
                >
                  Partners
                </Link>
              </li>
            </ul>
          </div> */}

          {/* 4th block */}
          {/* <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h6 className="text-gray-800 font-medium mb-2">Company</h6>
            <ul className="text-sm">
              <li className="mb-2">
                <Link
                  to="#"
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
                >
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
                >
                  About us
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
                >
                  Company values
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
                >
                  Pricing
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="#"
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div> */}

          {/* 5th block */}
          {/* <div className="sm:col-span-6 md:col-span-3 lg:col-span-3">
            <h6 className="text-gray-800 font-medium mb-2">Subscribe</h6>
            <p className="text-sm text-gray-600 mb-4">
              Get the latest news and articles to your inbox every month.
            </p>
            <form>
              <div className="flex flex-wrap mb-4">
                <div className="w-full">
                  <label className="block text-sm sr-only" htmlFor="newsletter">
                    Email
                  </label>
                  <div className="relative flex items-center max-w-xs">
                    <input
                      id="newsletter"
                      type="email"
                      className="form-input w-full text-gray-800 px-3 py-2 pr-12 text-sm"
                      placeholder="Your email"
                      required
                    />
                    <button
                      type="submit"
                      className="absolute inset-0 left-auto"
                      aria-label="Subscribe"
                    >
                      <span
                        className="absolute inset-0 right-auto w-px -ml-px my-2 bg-gray-300"
                        aria-hidden="true"
                      ></span>
                      <svg
                        className="w-3 h-3 fill-current text-blue-600 mx-3 flex-shrink-0"
                        viewBox="0 0 12 12"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.707 5.293L7 .586 5.586 2l3 3H0v2h8.586l-3 3L7 11.414l4.707-4.707a1 1 0 000-1.414z"
                          fillRule="nonzero"
                        />
                      </svg>
                    </button>
                  </div>
                  Success message
                  <p className="mt-2 text-green-600 text-sm">Thanks for subscribing!</p>
                </div>
              </div>
            </form>
          </div> */}
        </div>

        {/* Bottom area */}
        <div className="md:flex md:items-center md:justify-between py-4 md:py-8 border-t border-gray-200">
          {/* Social links */}
          <ul className="flex mb-4 md:order-1 md:ml-4 md:mb-0">
            <li>
              <a
                href="https://twitter.com/db_lens"
                className="flex justify-center items-center text-gray-600 hover:text-gray-900 bg-white hover:bg-white-100 rounded-full shadow transition duration-150 ease-in-out"
                aria-label="Twitter"
              >
                <svg
                  className="w-8 h-8 fill-current"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M24 11.5c-.6.3-1.2.4-1.9.5.7-.4 1.2-1 1.4-1.8-.6.4-1.3.6-2.1.8-.6-.6-1.5-1-2.4-1-1.7 0-3.2 1.5-3.2 3.3 0 .3 0 .5.1.7-2.7-.1-5.2-1.4-6.8-3.4-.3.5-.4 1-.4 1.7 0 1.1.6 2.1 1.5 2.7-.5 0-1-.2-1.5-.4 0 1.6 1.1 2.9 2.6 3.2-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.3 3.1 2.3-1.1.9-2.5 1.4-4.1 1.4H8c1.5.9 3.2 1.5 5 1.5 6 0 9.3-5 9.3-9.3v-.4c.7-.5 1.3-1.1 1.7-1.8z" />
                </svg>
              </a>
            </li>
            <li className="ml-4">
              <a
                href="https://github.com/dblens"
                className="flex justify-center items-center text-gray-600 hover:text-gray-900 bg-white hover:bg-white-100 rounded-full shadow transition duration-150 ease-in-out"
                aria-label="Github"
              >
                <svg
                  className="w-8 h-8 fill-current"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16 8.2c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4V22c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.7-3.7 3.9.3.4.6.9.6 1.6v2.2c0 .2.1.5.6.4 3.2-1.1 5.5-4.1 5.5-7.6-.1-4.4-3.7-8-8.1-8z" />
                </svg>
              </a>
            </li>
            <li className="ml-4">
              <a
                href="https://discord.com/invite/PZT4C5mk"
                className="flex justify-center items-center text-gray-600 hover:text-gray-900 bg-white hover:bg-white-100 rounded-full shadow transition duration-150 ease-in-out"
                aria-label="Discord"
              >
                <svg
                  width="32"
                  height="32"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                >
                  <defs>
                    <clipPath id="clip0">
                      <rect id="svg_1" fill="white" height="55" width="71" />
                    </clipPath>
                  </defs>
                  <g>
                    <title>Layer 1</title>
                    <g stroke="null" id="svg_2" clip-path="url(#clip0)">
                      <path
                        stroke="null"
                        id="svg_3"
                        fill="#23272A"
                        d="m22.15579,11.7024c-1.14888,-0.52716 -2.38088,-0.91554 -3.66902,-1.13799c-0.02346,-0.00429 -0.04689,0.00644 -0.05898,0.02789c-0.15845,0.28181 -0.33395,0.64945 -0.45686,0.93842c-1.38547,-0.20742 -2.76384,-0.20742 -4.1209,0c-0.12293,-0.29539 -0.30481,-0.65661 -0.46397,-0.93842c-0.01208,-0.02074 -0.03552,-0.03147 -0.05898,-0.02789c-1.28742,0.22173 -2.51943,0.61012 -3.66902,1.13799c-0.00995,0.00429 -0.01848,0.01145 -0.02414,0.02074c-2.33685,3.4912 -2.97701,6.89659 -2.66297,10.25977c0.00142,0.01645 0.01066,0.03219 0.02345,0.04219c1.54179,1.13225 3.03527,1.81963 4.50102,2.27525c0.02346,0.00716 0.04831,-0.00142 0.06324,-0.02074c0.34672,-0.47349 0.6558,-0.97274 0.9208,-1.49776c0.01564,-0.03074 0.00071,-0.06723 -0.03125,-0.07939c-0.49024,-0.18597 -0.95705,-0.41271 -1.40609,-0.67019c-0.03552,-0.02074 -0.03836,-0.07154 -0.00569,-0.09587c0.09449,-0.07081 0.18901,-0.14448 0.27924,-0.21887c0.01632,-0.01358 0.03907,-0.01645 0.05827,-0.00787c2.94998,1.34686 6.14369,1.34686 9.05886,0c0.01919,-0.00929 0.04194,-0.00642 0.05898,0.00716c0.09025,0.07439 0.18475,0.14877 0.27995,0.21958c0.03267,0.02432 0.03054,0.07512 -0.00498,0.09587c-0.44904,0.26249 -0.91585,0.48422 -1.4068,0.66948c-0.03196,0.01216 -0.04618,0.04935 -0.03054,0.0801c0.27069,0.52429 0.57976,1.02354 0.92009,1.49705c0.01422,0.02003 0.03978,0.02861 0.06324,0.02145c1.47286,-0.45561 2.96633,-1.14299 4.50812,-2.27525c0.01351,-0.01 0.02204,-0.02503 0.02346,-0.04148c0.37584,-3.88819 -0.62952,-7.26566 -2.6651,-10.25977c-0.00498,-0.01 -0.01348,-0.01716 -0.02343,-0.02145zm-9.23579,8.23269c-0.88815,0 -1.61996,-0.81539 -1.61996,-1.81676c0,-1.00138 0.71762,-1.81676 1.61996,-1.81676c0.90942,0 1.63415,0.82255 1.61993,1.81676c0,1.00138 -0.71762,1.81676 -1.61993,1.81676zm5.98951,0c-0.88812,0 -1.61993,-0.81539 -1.61993,-1.81676c0,-1.00138 0.71759,-1.81676 1.61993,-1.81676c0.90945,0 1.63415,0.82255 1.61996,1.81676c0,1.00138 -0.71051,1.81676 -1.61996,1.81676z"
                      />
                    </g>
                  </g>
                </svg>
              </a>
            </li>
          </ul>

          {/* Copyrights note */}
          <div className="text-sm text-gray-600 mr-4">
            Made by{" "}
            <a
              className="text-blue-600 hover:underline"
              href="https://dblens.com/"
            >
              DB Lens
            </a>
            . All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
