import React from "react";

function Newsletter() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pb-12 md:pb-20">
          {/* CTA box */}
          <div
            className="relative bg-gray-900 rounded py-10 px-8 md:py-16 md:px-12 shadow-2xl overflow-hidden"
            data-aos="zoom-y-out"
          >
            {/* Background illustration */}
            <div
              className="absolute right-0 bottom-0 pointer-events-none hidden lg:block"
              aria-hidden="true"
            >
              {/* <svg width="428" height="328" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient
                    cx="35.542%"
                    cy="34.553%"
                    fx="35.542%"
                    fy="34.553%"
                    r="96.031%"
                    id="ni-a"
                  >
                    <stop stopColor="#DFDFDF" offset="0%" />
                    <stop stopColor="#4C4C4C" offset="44.317%" />
                    <stop stopColor="#333" offset="100%" />
                  </radialGradient>
                </defs>
                <g fill="none" fillRule="evenodd">
                  <g fill="#FFF">
                    <ellipse
                      fillOpacity=".04"
                      cx="185"
                      cy="15.576"
                      rx="16"
                      ry="15.576"
                    />
                    <ellipse
                      fillOpacity=".24"
                      cx="100"
                      cy="68.402"
                      rx="24"
                      ry="23.364"
                    />
                    <ellipse
                      fillOpacity=".12"
                      cx="29"
                      cy="251.231"
                      rx="29"
                      ry="28.231"
                    />
                    <ellipse
                      fillOpacity=".64"
                      cx="29"
                      cy="251.231"
                      rx="8"
                      ry="7.788"
                    />
                    <ellipse
                      fillOpacity=".12"
                      cx="342"
                      cy="31.303"
                      rx="8"
                      ry="7.788"
                    />
                    <ellipse
                      fillOpacity=".48"
                      cx="62"
                      cy="126.811"
                      rx="2"
                      ry="1.947"
                    />
                    <ellipse
                      fillOpacity=".12"
                      cx="78"
                      cy="7.072"
                      rx="2"
                      ry="1.947"
                    />
                    <ellipse
                      fillOpacity=".64"
                      cx="185"
                      cy="15.576"
                      rx="6"
                      ry="5.841"
                    />
                  </g>
                  <circle fill="url(#ni-a)" cx="276" cy="237" r="200" />
                </g>
              </svg>
             */}
            </div>

            <div className="relative flex flex-col lg:flex-row justify-between items-center">
              {/* CTA content */}
              <div className="text-center lg:text-left lg:max-w-xl">
                <h3 className="h3 text-white mb-2">Want to know more?</h3>
                <p className="text-gray-300 text-lg mb-6">
                  Subscribe to our newsletter to get latest product updates.
                </p>

                {/* <div id="mc_embed_signup">
                  <form
                    action="https://gmail.us6.list-manage.com/subscribe/post?u=a6673f1548af9957c418547c6&amp;id=4e57809de1"
                    method="post"
                    id="mc-embedded-subscribe-form"
                    name="mc-embedded-subscribe-form"
                    className="validate"
                    target="_blank"
                    novalidate
                  >
                    <div id="mc_embed_signup_scroll">
                      <div className="mc-field-group">
                        <label for="mce-EMAIL">Email Address </label>
                        <input
                          type="email"
                          value=""
                          name="EMAIL"
                          className="required email"
                          id="mce-EMAIL"
                        />
                      </div>
                      <div id="mce-responses" className="clear">
                        <div
                          className="response"
                          id="mce-error-response"
                          style="display:none"
                        ></div>
                        <div
                          className="response"
                          id="mce-success-response"
                          style="display:none"
                        ></div>
                      </div>
                      <div
                        style="position: absolute; left: -5000px;"
                        aria-hidden="true"
                      >
                        <input
                          type="text"
                          name="b_a6673f1548af9957c418547c6_4e57809de1"
                          tabindex="-1"
                          value=""
                        />
                      </div>
                      <div className="clear">
                        <input
                          type="submit"
                          value="Subscribe"
                          name="subscribe"
                          id="mc-embedded-subscribe"
                          className="button"
                        />
                      </div>
                    </div>
                  </form>
                </div> */}

                {/* CTA form */}
                <form
                  className="w-full lg:w-auto"
                  action="https://gmail.us6.list-manage.com/subscribe/post?u=a6673f1548af9957c418547c6&amp;id=4e57809de1"
                  method="post"
                  id="mc-embedded-subscribe-form"
                  name="mc-embedded-subscribe-form"
                  className="validate"
                  target="_blank"
                  novalidate
                >
                  <div className="flex flex-col sm:flex-row justify-center max-w-xs mx-auto sm:max-w-md lg:mx-0">
                    <input
                      type="email"
                      className="w-full appearance-none bg-gray-800 border border-gray-700 focus:border-gray-600 rounded-sm px-4 py-3 mb-2 sm:mb-0 sm:mr-2 text-white placeholder-gray-500 required email"
                      placeholder="Your email…"
                      aria-label="Your email…"
                      name="EMAIL"
                      id="mce-EMAIL"
                    />
                    <input
                      type="submit"
                      value="Subscribe"
                      name="subscribe"
                      id="mc-embedded-subscribe"
                      className="btn text-white bg-blue-600 hover:bg-blue-700 shadow"
                    />
                    <div
                      style={{ position: "absolute", left: "-5000px" }}
                      aria-hidden="true"
                    >
                      <input
                        type="text"
                        name="b_a6673f1548af9957c418547c6_4e57809de1"
                        tabindex="-1"
                        value=""
                      />
                    </div>
                  </div>
                  {/* Success message */}
                  {/* <p className="text-sm text-gray-400 mt-3">Thanks for subscribing!</p> */}
                  <p className="text-sm text-gray-400 mt-3">
                    {/* 7 days free trial. No credit card required. */}
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Newsletter;
