import React, { useState } from "react";
import Logo from "../../../assets/img/lmslogo.svg";
const Footer = () => {
  const [emailToolTip, setEmailToolTip] = useState(false);
  const [phoneToolTip, setPhoneToolTip] = useState(false);
  const [addressToolTip, setAddressToolTip] = useState(false);

  return (
    <footer className="bg-[#282828]">
      <div className="mx-auto max-w-screen-xl px-4 pb-6 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="flex justify-center sm:justify-start text-teal-300">
              <img src={Logo} alt="Logo" className="h-16 w-auto" />
            </div>

            <p className="mt-6 max-w-md text-center leading-relaxed sm:max-w-xs sm:text-left text-gray-400">
              Smart assistant for library management.
            </p>

            <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
              <li>
                <a
                  href="https://www.facebook.com/yourprassamin"
                  rel="noreferrer"
                  target="_blank"
                  className="text-white transition hover:text-[#3b5998]"
                >
                  <span className="sr-only">Facebook</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="bi bi-facebook w-5 h-5"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
                  </svg>
                </a>
              </li>

              <li>
                <a
                  href="https://www.instagram.com/imprassamin/"
                  rel="noreferrer"
                  target="_blank"
                  className="text-white transition hover:text-[#E1306C]"
                >
                  <span className="sr-only">Instagram</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="bi bi-instagram w-5 h-5"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
                  </svg>
                </a>
              </li>

              <li>
                <a
                  href="https://twitter.com/prassamin78"
                  rel="noreferrer"
                  target="_blank"
                  className="text-white transition hover:text-[skyblue]"
                >
                  <span className="sr-only">Twitter</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="bi bi-twitter-x h-5 w-5"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
                  </svg>
                </a>
              </li>

              <li>
                <a
                  href="https://github.com/PRASSamin"
                  rel="noreferrer"
                  target="_blank"
                  className="transition text-white hover:text-[#c8c8c8]"
                >
                  <span className="sr-only">GitHub</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="bi bi-github h-5 w-5"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
                  </svg>
                </a>
              </li>

              <li>
                <a
                  href="https://www.linkedin.com/in/pras-samin-826421270/"
                  rel="noreferrer"
                  target="_blank"
                  className="transition text-white hover:text-[#0077b5]"
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="w-[19px] h-5"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/5NPyRUKZ7a"
                  rel="noreferrer"
                  target="_blank"
                  className="transition text-white hover:text-[#5865F2]"
                >
                  <span className="sr-only">Discord</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="bi bi-discord w-5 h-5"
                    viewBox="0 0 16 16"
                  >
                    <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2">
            <div className="text-center sm:text-left">
              <p className="text-lg text-white font-bold">Main</p>

              <ul className="mt-8 space-y-4 text-sm">
                <li>
                  <a
                    className="transition text-white hover:text-white/75"
                    href="/"
                  >
                    Home
                  </a>
                </li>

                <li>
                  <a
                    className="transition text-white hover:text-white/75"
                    href="/books"
                  >
                    Books
                  </a>
                </li>

                <li>
                  <a
                    className="transition text-white hover:text-white/75"
                    href="#"
                  >
                    Check Availability
                  </a>
                </li>

                <li>
                  <a
                    className="transition text-white hover:text-white/75"
                    href="#"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div className="relative text-center sm:text-left">
              <div className="absolute inset-0 flex sm:-left-5 -top-5 -bottom-5 justify-center items-center bg-black/60 text-white text-2xl font-bold rounded-lg">
                Locked
              </div>
              <p className="text-lg font-bold text-white">About Us</p>

              <ul className="mt-8 space-y-4 text-sm">
                <li>
                  <a
                    className="transition text-white hover:text-white/75"
                    href="#"
                  >
                    Company History
                  </a>
                </li>

                <li>
                  <a
                    className="transition text-white hover:text-white/75"
                    href="#"
                  >
                    Meet the Team
                  </a>
                </li>

                <li>
                  <a
                    className="transition text-white hover:text-white/75"
                    href="#"
                  >
                    Employee Handbook
                  </a>
                </li>

                <li>
                  <a
                    className="transition text-white hover:text-white/75"
                    href="#"
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            <div className="relative text-center sm:text-left">
              <div className="absolute z-10 inset-0 flex sm:-left-5 -top-5 justify-center items-center bg-black/60 text-white text-2xl font-bold rounded-lg">
                Locked
              </div>
              <p className="text-lg font-bold text-white">Helpful Links</p>

              <ul className="mt-8 space-y-4 text-sm">
                <li>
                  <a
                    className="transition text-white hover:text-white/75"
                    href="#"
                  >
                    FAQs
                  </a>
                </li>

                <li>
                  <a
                    className="transition text-white hover:text-white/75"
                    href="#"
                  >
                    Support
                  </a>
                </li>

                <li>
                  <a
                    className="group flex justify-center sm:justify-start gap-1.5 ltr:sm:justify-start rtl:sm:justify-end"
                    href="#"
                  >
                    <span className="transition text-white hover:text-white/75">
                      Live Chat
                    </span>

                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex size-2 rounded-full bg-green-400"></span>
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-bold text-white">Contact Us</p>

              <ul className="mt-8 space-y-4 text-sm">
                <li className="relative">
                  <a
                    onMouseEnter={() => setEmailToolTip(true)}
                    onMouseLeave={() => setEmailToolTip(false)}
                    className="flex items-center justify-center gap-1.5 ltr:sm:justify-start rtl:sm:justify-end"
                    href="mailto:prassamin@gmail.com"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5 shrink-0 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="flex-1 text-gray-300 truncate">
                      {" "}
                      prassamin@gmail.com{" "}
                    </span>
                  </a>
                  <ToolTip
                    left={"-11.5rem"}
                    smLeft={"2.5rem"}
                    ttText={"prassamin@gmail.com"}
                    ttFunc={emailToolTip}
                  />
                </li>
                <li className="relative">
                  <a
                    onMouseEnter={() => setPhoneToolTip(true)}
                    onMouseLeave={() => setPhoneToolTip(false)}
                    className="flex items-center justify-center gap-1.5 ltr:sm:justify-start rtl:sm:justify-end"
                    href="tel:+8801725314886"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5 shrink-0 text-gray-900 dark:text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>

                    <span className="flex-1 text-gray-700 dark:text-gray-300">
                      017XX-XXXXXX
                    </span>
                  </a>
                  <ToolTip
                    left={"-9.2rem"}
                    smLeft={"6rem"}
                    ttText={"017XX-XXXXXX"}
                    ttFunc={phoneToolTip}
                  />
                </li>

                <li
                  className="relative cursor-pointer flex items-center justify-center gap-1.5 ltr:sm:justify-start rtl:sm:justify-end"
                  onMouseEnter={() => setAddressToolTip(true)}
                  onMouseLeave={() => setAddressToolTip(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5 shrink-0 text-gray-900 dark:text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>

                  <address className="-mt-0.5 flex-1 not-italic text-gray-300">
                    Washington, D.C.
                  </address>
                  <ToolTip
                    left={"-9.5rem"}
                    smLeft={"5.5rem"}
                    ttText={"Washington, D.C."}
                    ttFunc={addressToolTip}
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-6 border-gray-800">
          <div className="text-center sm:flex sm:justify-between sm:text-left">
            <p className="text-sm text-gray-400">
              <span className="block sm:inline">All rights reserved.</span>

              <a
                className="inline-block underline transition text-red-400 hover:text-red-400/75"
                href="#"
              >
                Terms & Conditions
              </a>

              <span>&middot;</span>

              <a
                className="inline-block underline transition text-red-400 hover:text-red-400/75"
                href="#"
              >
                Privacy Policy
              </a>
            </p>

            <p className="mt-4 text-sm sm:order-first sm:mt-0 text-gray-400">
              &copy; 2022{" "}
              <a href="#" className="font-bold">
                PRAS
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

export const ToolTip = ({ ttText, ttFunc, left, smLeft }) => {
  return (
    <div
      style={{
        left: `${left}`,
        ...(window.innerWidth < 640 ? { left: `${smLeft}` } : {}),
      }}
      className={`${
        ttFunc ? "block" : "hidden"
      } text-white absolute -top-2 bg-[#161616] px-4 py-2 z-[10] rounded-md after:content-[''] after:z-[-1] after:absolute after:h-3 after:w-3 after:bg-[#161616] after:rotate-45 after:top-[50%] after:transform after:translate-y-[-50%] after:-right-1.5`}
    >
      {ttText}
    </div>
  );
};
