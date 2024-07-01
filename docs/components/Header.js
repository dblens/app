import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
function Header() {
  const [top, setTop] = useState(true);

  // detect whether user has scrolled the page down by 10px
  useEffect(() => {
    const scrollHandler = () => {
      window.pageYOffset > 10 ? setTop(false) : setTop(true);
    };
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [top]);

  return (
    <header
      className={`fixed w-full z-30 md:bg-opacity-90 transition duration-300 ease-in-out ${
        !top && "bg-white blur shadow-lg"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Site branding */}
          <div className="flex-shrink-0 mr-4 flex flex-row">
            {/* <Link to="/" className="block" aria-label="DB Lens"> */}
            <img alt="logo" height={50} width={50} src="/images/favicon.png" />
            {/* </Link> */}
            <span className="font-bold m-auto text-2xl">DB Lens</span>
          </div>
          <div className="flex flex-row">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400 text-2xl font-bold px-2">
              <a
                href="https://www.producthunt.com/posts/db-lens?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-db-lens"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=315209&theme=dark"
                  alt="DB Lens - Explore data, execute SQL, metrics, disk usage & more | Product Hunt"
                  style={{ width: 250, height: 45 }}
                />
              </a>
            </span>
            <span className="pt-2">
              <iframe
                src="https://ghbtns.com/github-btn.html?user=dblens&repo=app&type=star&count=true&size=large"
                frameborder="0"
                scrolling="0"
                width="170"
                height="30"
                title="GitHub"
              ></iframe>
            </span>
          </div>
          {/* Site navigation */}
          {/* <nav className="flex flex-grow">
            <ul className="flex flex-grow justify-end flex-wrap items-center">
              <li>
                <Link to="/signin" className="font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out">Sign in</Link>
              </li>
              <li>
                <Link to="/signup" className="btn-sm text-gray-200 bg-gray-900 hover:bg-gray-800 ml-3">
                  <span>Sign up</span>
                  <svg className="w-3 h-3 fill-current text-gray-400 flex-shrink-0 ml-2 -mr-1" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.707 5.293L7 .586 5.586 2l3 3H0v2h8.586l-3 3L7 11.414l4.707-4.707a1 1 0 000-1.414z" fillRule="nonzero" />
                  </svg>                  
                </Link>
              </li>
            </ul>

          </nav> */}
        </div>
      </div>
    </header>
  );
}

export default Header;
