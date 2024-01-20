import React from "react";
import getGoogleOAuthURL from "../utils/getGoogleUrl";

const Googleauth = () => {
  return (
    <div>
      <div className="px-6 sm:px-0 max-w-sm">
        <a
          a
          href={getGoogleOAuthURL()}
          className="text-black w-full  bg-white hover:bg-gray-100 border border-gray-300 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium  rounded-3xl text-base px-5 py-2.5 text-center flex gap-4 items-center justify-between dark:focus:ring-[#4285F4]/55 mr-2 mb-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M25.4016 13.2557C25.4016 12.3669 25.3221 11.4799 25.164 10.6053H12.96V15.6187H19.9346C19.7903 16.4117 19.4867 17.1673 19.0421 17.8396C18.5975 18.512 18.0212 19.0872 17.348 19.5305V22.7823H21.5362C22.8119 21.554 23.8151 20.0713 24.4808 18.4303C25.1465 16.7893 25.4598 15.0266 25.4005 13.2567L25.4016 13.2557Z"
              fill="#4285F4"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12.9608 25.9209C16.1157 26.0066 19.1841 24.8835 21.5382 22.7813L17.3499 19.5294C16.3481 20.1725 15.2126 20.5782 14.0301 20.7158C12.8475 20.8534 11.6492 20.7192 10.5264 20.3233C9.40369 19.9275 8.38615 19.2805 7.5514 18.4317C6.71665 17.5828 6.08674 16.5546 5.70971 15.4254H1.37891V18.7831C2.45818 20.9294 4.11278 22.7335 6.15797 23.9939C8.20317 25.2543 10.5584 25.9215 12.9608 25.9209Z"
              fill="#34A853"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M5.70816 15.4233C5.16618 13.8264 5.16618 12.0953 5.70816 10.4985V7.14075H1.37844C0.472019 8.94698 0 10.94 0 12.9609C0 14.9818 0.472019 16.9748 1.37844 18.781L5.70816 15.4233Z"
              fill="#FBBC05"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12.9608 5.15568C14.8029 5.12496 16.5828 5.82149 17.9148 7.09428L21.6321 3.37584C19.2862 1.1729 16.1787 -0.0365875 12.9608 0.000843591C10.5582 0.000418852 8.20278 0.66788 6.15757 1.92869C4.11235 3.1895 2.45788 4.99401 1.37891 7.14072L5.70863 10.4984C6.20669 8.96122 7.17432 7.61891 8.47529 6.66047C9.77626 5.70204 11.3451 5.17574 12.9608 5.15568Z"
              fill="#EA4335"
            />
          </svg>
          Sign up with Google<div></div>
        </a>
      </div>
    </div>
  );
};

export default Googleauth;
