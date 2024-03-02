import {Menu} from "antd";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import {url} from "../../Config.jsx";

function Sidenav() {
  const {pathname} = useLocation();
  const page = pathname.replace("/", "");

  const navigate = useNavigate();

  const Logout = async () => {
    const {data} = await axios.post(
        `${url}/api/v1/logout`,
        {},
        {withCredentials: true}
    );
    if (data.success) {
      navigate('/sign-in')
    }
  };

  const tables = [
    <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        key={0}
    >
      <path
          d="M9 2C8.44772 2 8 2.44772 8 3C8 3.55228 8.44772 4 9 4H11C11.5523 4 12 3.55228 12 3C12 2.44772 11.5523 2 11 2H9Z"
          fill="#A3842E"
      ></path>
      <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4 5C4 3.89543 4.89543 3 6 3C6 4.65685 7.34315 6 9 6H11C12.6569 6 14 4.65685 14 3C15.1046 3 16 3.89543 16 5V16C16 17.1046 15.1046 18 14 18H6C4.89543 18 4 17.1046 4 16V5ZM7 9C6.44772 9 6 9.44772 6 10C6 10.5523 6.44772 11 7 11H7.01C7.56228 11 8.01 10.5523 8.01 10C8.01 9.44772 7.56228 9 7.01 9H7ZM10 9C9.44772 9 9 9.44772 9 10C9 10.5523 9.44772 11 10 11H13C13.5523 11 14 10.5523 14 10C14 9.44772 13.5523 9 13 9H10ZM7 13C6.44772 13 6 13.4477 6 14C6 14.5523 6.44772 15 7 15H7.01C7.56228 15 8.01 14.5523 8.01 14C8.01 13.4477 7.56228 13 7.01 13H7ZM10 13C9.44772 13 9 13.4477 9 14C9 14.5523 9.44772 15 10 15H13C13.5523 15 14 14.5523 14 14C14 13.4477 13.5523 13 13 13H10Z"
          fill="#A3842E"
      ></path>
    </svg>,
  ];

  const telegramUserIcon = [
    <svg width="20"
         height="20"
         viewBox="0 0 24 24"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         key={0}
    >
      <path fillRule="evenodd" clipRule="evenodd"
            d="M5.78754 14.0196C5.83131 14.0344 5.87549 14.0448 5.91963 14.0512C5.96777 14.1644 6.02996 14.3107 6.10252 14.4818C6.27959 14.8994 6.51818 15.4643 6.76446 16.0535C7.2667 17.2552 7.77332 18.4939 7.88521 18.8485C8.02372 19.2868 8.17013 19.5848 8.32996 19.7883C8.4126 19.8935 8.50819 19.9853 8.62003 20.0549C8.67633 20.0899 8.7358 20.1186 8.79788 20.14C8.80062 20.141 8.80335 20.1419 8.80608 20.1428C9.1261 20.2636 9.41786 20.2133 9.60053 20.1518C9.69827 20.1188 9.77735 20.0791 9.8334 20.0469C9.86198 20.0304 9.88612 20.0151 9.90538 20.0021L9.90992 19.9991L12.7361 18.2366L16.0007 20.7394C16.0488 20.7763 16.1014 20.8073 16.157 20.8316C16.5492 21.0027 16.929 21.0624 17.2862 21.0136C17.6429 20.9649 17.926 20.8151 18.1368 20.6464C18.3432 20.4813 18.4832 20.2963 18.5703 20.1589C18.6148 20.0887 18.6482 20.0266 18.6718 19.9791C18.6836 19.9552 18.6931 19.9346 18.7005 19.9181L18.7099 19.8963L18.7135 19.8877L18.715 19.8841L18.7156 19.8824L18.7163 19.8808C18.7334 19.8379 18.7466 19.7935 18.7556 19.7482L21.7358 4.72274C21.7453 4.67469 21.7501 4.62581 21.7501 4.57682C21.7501 4.13681 21.5843 3.71841 21.1945 3.46452C20.8613 3.24752 20.4901 3.23818 20.2556 3.25598C20.0025 3.27519 19.7688 3.33766 19.612 3.38757C19.5304 3.41355 19.4619 3.43861 19.4126 3.45773C19.3878 3.46734 19.3675 3.47559 19.3523 3.48188L19.341 3.48666L2.62725 10.0432L2.62509 10.044C2.61444 10.0479 2.60076 10.053 2.58451 10.0593C2.55215 10.0719 2.50878 10.0896 2.45813 10.1126C2.35935 10.1574 2.22077 10.2273 2.07856 10.3247C1.85137 10.4803 1.32888 10.9064 1.41686 11.6097C1.48705 12.1708 1.87143 12.5154 2.10562 12.6811C2.23421 12.7721 2.35638 12.8371 2.44535 12.8795C2.48662 12.8991 2.57232 12.9339 2.6095 12.9491L2.61889 12.9529L5.78754 14.0196ZM19.9259 4.86786L19.9236 4.86888C19.9152 4.8725 19.9069 4.87596 19.8984 4.87928L3.1644 11.4438C3.15566 11.4472 3.14686 11.4505 3.138 11.4536L3.12869 11.4571C3.11798 11.4613 3.09996 11.4686 3.07734 11.4788C3.06451 11.4846 3.05112 11.491 3.03747 11.4978C3.05622 11.5084 3.07417 11.5175 3.09012 11.5251C3.10543 11.5324 3.11711 11.5374 3.1235 11.54L6.26613 12.598C6.32365 12.6174 6.37727 12.643 6.42649 12.674L16.8033 6.59948L16.813 6.59374C16.8205 6.58927 16.8305 6.58353 16.8424 6.5768C16.866 6.56345 16.8984 6.54568 16.937 6.52603C17.009 6.48938 17.1243 6.43497 17.2541 6.39485C17.3444 6.36692 17.6109 6.28823 17.899 6.38064C18.0768 6.43767 18.2609 6.56028 18.3807 6.76798C18.4401 6.87117 18.4718 6.97483 18.4872 7.06972C18.528 7.2192 18.5215 7.36681 18.4896 7.49424C18.4208 7.76875 18.228 7.98287 18.0525 8.14665C17.9021 8.28706 15.9567 10.1629 14.0376 12.0147C13.0805 12.9381 12.1333 13.8525 11.4252 14.5359L10.9602 14.9849L16.8321 19.4867C16.9668 19.5349 17.0464 19.5325 17.0832 19.5274C17.1271 19.5214 17.163 19.5045 17.1997 19.4752C17.2407 19.4424 17.2766 19.398 17.3034 19.3557L17.3045 19.354L20.195 4.78102C20.1521 4.79133 20.1087 4.80361 20.0669 4.81691C20.0196 4.83198 19.9805 4.84634 19.9547 4.85637C19.9418 4.86134 19.9326 4.86511 19.9276 4.86719L19.9259 4.86786ZM11.4646 17.2618L10.2931 16.3636L10.0093 18.1693L11.4646 17.2618ZM9.21846 14.5814L10.3834 13.4567C11.0915 12.7732 12.0389 11.8588 12.9961 10.9352L13.9686 9.997L7.44853 13.8138L7.48351 13.8963C7.66121 14.3154 7.90087 14.8827 8.14845 15.4751C8.33358 15.918 8.52717 16.3844 8.70349 16.8162L8.98653 15.0158C9.01381 14.8422 9.09861 14.692 9.21846 14.5814Z"
            fill="#A3842E"></path>
    </svg>,
  ];

  const chatGpt = [
    <svg width="25" height="25" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="#000000">
              <path
                  d="M45.6,18.7,41,14.9V7.5a1,1,0,0,0-.6-.9L30.5,2.1h-.4l-.6.2L24,5.9,18.5,2.2,17.9,2h-.4L7.6,6.6a1,1,0,0,0-.6.9v7.4L2.4,18.7a.8.8,0,0,0-.4.8v9H2a.8.8,0,0,0,.4.8L7,33.1v7.4a1,1,0,0,0,.6.9l9.9,4.5h.4l.6-.2L24,42.1l5.5,3.7.6.2h.4l9.9-4.5a1,1,0,0,0,.6-.9V33.1l4.6-3.8a.8.8,0,0,0,.4-.7V19.4h0A.8.8,0,0,0,45.6,18.7Zm-5.1,6.8H42v1.6l-3.5,2.8-.4.3-.4-.2a1.4,1.4,0,0,0-2,.7,1.5,1.5,0,0,0,.6,2l.7.3h0v5.4l-6.6,3.1-4.2-2.8-.7-.5V25.5H27a1.5,1.5,0,0,0,0-3H25.5V9.7l.7-.5,4.2-2.8L37,9.5v5.4h0l-.7.3a1.5,1.5,0,0,0-.6,2,1.4,1.4,0,0,0,1.3.9l.7-.2.4-.2.4.3L42,20.9v1.6H40.5a1.5,1.5,0,0,0,0,3ZM21,25.5h1.5V38.3l-.7.5-4.2,2.8L11,38.5V33.1h0l.7-.3a1.5,1.5,0,0,0,.6-2,1.4,1.4,0,0,0-2-.7l-.4.2-.4-.3L6,27.1V25.5H7.5a1.5,1.5,0,0,0,0-3H6V20.9l3.5-2.8.4-.3.4.2.7.2a1.4,1.4,0,0,0,1.3-.9,1.5,1.5,0,0,0-.6-2L11,15h0V9.5l6.6-3.1,4.2,2.8.7.5V22.5H21a1.5,1.5,0,0,0,0,3Z"></path>
              <path
                  d="M13.9,9.9a1.8,1.8,0,0,0,0,2.2l2.6,2.5v2.8l-4,4v5.2l4,4v2.8l-2.6,2.5a1.8,1.8,0,0,0,0,2.2,1.5,1.5,0,0,0,1.1.4,1.5,1.5,0,0,0,1.1-.4l3.4-3.5V29.4l-4-4V22.6l4-4V13.4L16.1,9.9A1.8,1.8,0,0,0,13.9,9.9Z"></path>
              <path
                  d="M31.5,14.6l2.6-2.5a1.8,1.8,0,0,0,0-2.2,1.8,1.8,0,0,0-2.2,0l-3.4,3.5v5.2l4,4v2.8l-4,4v5.2l3.4,3.5a1.7,1.7,0,0,0,2.2,0,1.8,1.8,0,0,0,0-2.2l-2.6-2.5V30.6l4-4V21.4l-4-4Z"></path>
    </svg>
  ]

  const logout = [
    // eslint-disable-next-line react/jsx-key
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd"
            d="M16.125 12C16.125 11.5858 15.7892 11.25 15.375 11.25L4.40244 11.25L6.36309 9.56944C6.67759 9.29988 6.71401 8.8264 6.44444 8.51191C6.17488 8.19741 5.7014 8.16099 5.38691 8.43056L1.88691 11.4306C1.72067 11.573 1.625 11.7811 1.625 12C1.625 12.2189 1.72067 12.427 1.88691 12.5694L5.38691 15.5694C5.7014 15.839 6.17488 15.8026 6.44444 15.4881C6.71401 15.1736 6.67759 14.7001 6.36309 14.4306L4.40244 12.75L15.375 12.75C15.7892 12.75 16.125 12.4142 16.125 12Z"
            fill="#8B1919"></path>
      <path
          d="M9.375 8C9.375 8.70219 9.375 9.05329 9.54351 9.3055C9.61648 9.41471 9.71025 9.50848 9.81946 9.58145C10.0717 9.74996 10.4228 9.74996 11.125 9.74996L15.375 9.74996C16.6176 9.74996 17.625 10.7573 17.625 12C17.625 13.2426 16.6176 14.25 15.375 14.25L11.125 14.25C10.4228 14.25 10.0716 14.25 9.8194 14.4185C9.71023 14.4915 9.6165 14.5852 9.54355 14.6944C9.375 14.9466 9.375 15.2977 9.375 16C9.375 18.8284 9.375 20.2426 10.2537 21.1213C11.1324 22 12.5464 22 15.3748 22L16.3748 22C19.2032 22 20.6174 22 21.4961 21.1213C22.3748 20.2426 22.3748 18.8284 22.3748 16L22.3748 8C22.3748 5.17158 22.3748 3.75736 21.4961 2.87868C20.6174 2 19.2032 2 16.3748 2L15.3748 2C12.5464 2 11.1324 2 10.2537 2.87868C9.375 3.75736 9.375 5.17157 9.375 8Z"
          fill="#8B1919"></path>
    </svg>
  ]

  const gamesIcon = [
    // eslint-disable-next-line react/jsx-key
    <svg width="20"
         height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="#000000">
        <rect x="0" fill="none" width="20" height="20"></rect>
          <path
              d="M17 8h1v11H2V8h1V6c0-2.76 2.24-5 5-5 .71 0 1.39.15 2 .42.61-.27 1.29-.42 2-.42 2.76 0 5 2.24 5 5v2zM5 6v2h2V6c0-1.13.39-2.16 1.02-3H8C6.35 3 5 4.35 5 6zm10 2V6c0-1.65-1.35-3-3-3h-.02c.63.84 1.02 1.87 1.02 3v2h2zm-5-4.22C9.39 4.33 9 5.12 9 6v2h2V6c0-.88-.39-1.67-1-2.22z"></path>

    </svg>
  ];

  const language = [
    <svg width="28"
         height="28" fill="none" viewBox="0 0 36 36" version="1.1" preserveAspectRatio="xMidYMid meet"
         xmlns="http://www.w3.org/2000/svg">
      <polygon points="11,16.5 10,19.6 12,19.6 11,16.5 " className="clr-i-solid clr-i-solid-path-1"></polygon>
      <path
          d="M30.3,3h-16v5h4v2h-13c-1.7,0-3,1.3-3,3v11c0,1.7,1.3,3,3,3h1v5.1l6.3-5.1h6.7v-7h11c1.7,0,3-1.3,3-3V6 C33.3,4.3,32,3,30.3,3z M13.1,22.9l-0.5-1.6H9.5l-0.6,1.6H6.5L9.8,14h2.4l3.3,8.9L13.1,22.9z M28.3,15v2c-1.3,0-2.7-0.4-3.9-1 c-1.2,0.6-2.6,0.9-4,1l-0.1-2c0.7,0,1.4-0.1,2.1-0.3c-0.9-0.9-1.5-2-1.8-3.2h2.1c0.3,0.9,0.9,1.6,1.6,2.2c1.1-0.9,1.8-2.2,1.9-3.7 h-6V8h3V6h2v2h3.3l0.1,1c0.1,2.1-0.7,4.2-2.2,5.7C27.1,14.9,27.7,15,28.3,15z"
            className="clr-i-solid clr-i-solid-path-2"></path>
        <rect x="0" y="0" width="36" height="36" fillOpacity="0"></rect>
    </svg>
  ]

  const reviews = [
    <svg viewBox="0 0 24 24" width="28"
         height="28" version="1.1" xmlns="http://www.w3.org/2000/svg"
         fill="#000000">
            <path
                d="M10.75,14 C11.9926407,14 13,15.0073593 13,16.25 L13,17.7519766 L12.9921156,17.8604403 C12.6813607,19.9866441 10.7715225,21.0090369 7.5667905,21.0090369 C4.37361228,21.0090369 2.43330141,19.9983408 2.01446278,17.8965776 L2,17.75 L2,16.25 C2,15.0073593 3.00735931,14 4.25,14 L10.75,14 Z M7.5,6 C9.43299662,6 11,7.56700338 11,9.5 C11,11.4329966 9.43299662,13 7.5,13 C5.56700338,13 4,11.4329966 4,9.5 C4,7.56700338 5.56700338,6 7.5,6 Z M19.75,2 C20.9926407,2 22,3.00735931 22,4.25 L22,7.75 C22,8.99264069 20.9926407,10 19.75,10 L18.197189,10 L15.6555465,12.2070729 C15.2384861,12.5691213 14.6068936,12.5245251 14.2448452,12.1074647 C14.0869422,11.9255688 14,11.6927904 14,11.4522588 L13.9993343,9.98619411 C12.8746672,9.86153043 12,8.90790995 12,7.75 L12,4.25 C12,3.00735931 13.0073593,2 14.25,2 L19.75,2 Z"
                id="🎨-Color"></path>
    </svg>
  ]

  const home = [
    <svg viewBox="0 0 24 24" width="20"
         height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
          d="M9.44669 15.3973C9.11392 15.1506 8.64421 15.2204 8.39755 15.5532C8.1509 15.8859 8.2207 16.3557 8.55347 16.6023C9.52588 17.3231 10.7151 17.7498 12.0001 17.7498C13.2851 17.7498 14.4743 17.3231 15.4467 16.6023C15.7795 16.3557 15.8493 15.8859 15.6026 15.5532C15.3559 15.2204 14.8862 15.1506 14.5535 15.3973C13.8251 15.9371 12.946 16.2498 12.0001 16.2498C11.0542 16.2498 10.175 15.9371 9.44669 15.3973Z"
          fill="#1C274C"></path>
      <path fillRule="evenodd" clipRule="evenodd"
            d="M12 1.25C11.2749 1.25 10.6134 1.44911 9.88928 1.7871C9.18832 2.11428 8.37772 2.59716 7.36183 3.20233L5.90622 4.06943C4.78711 4.73606 3.89535 5.26727 3.22015 5.77524C2.52314 6.29963 1.99999 6.8396 1.65907 7.55072C1.31799 8.26219 1.22554 9.0068 1.25519 9.87584C1.2839 10.717 1.43105 11.7397 1.61556 13.0219L1.90792 15.0537C2.14531 16.7036 2.33368 18.0128 2.61512 19.0322C2.90523 20.0829 3.31686 20.9169 4.05965 21.5565C4.80184 22.1956 5.68984 22.4814 6.77634 22.6177C7.83154 22.75 9.16281 22.75 10.8423 22.75H13.1577C14.8372 22.75 16.1685 22.75 17.2237 22.6177C18.3102 22.4814 19.1982 22.1956 19.9404 21.5565C20.6831 20.9169 21.0948 20.0829 21.3849 19.0322C21.6663 18.0129 21.8547 16.7036 22.0921 15.0537L22.3844 13.0219C22.569 11.7396 22.7161 10.717 22.7448 9.87584C22.7745 9.0068 22.682 8.26219 22.3409 7.55072C22 6.8396 21.4769 6.29963 20.7799 5.77524C20.1047 5.26727 19.2129 4.73606 18.0938 4.06943L16.6382 3.20233C15.6223 2.59716 14.8117 2.11428 14.1107 1.7871C13.3866 1.44911 12.7251 1.25 12 1.25ZM8.09558 4.51121C9.15309 3.88126 9.89923 3.43781 10.5237 3.14633C11.1328 2.86203 11.5708 2.75 12 2.75C12.4293 2.75 12.8672 2.86203 13.4763 3.14633C14.1008 3.43781 14.8469 3.88126 15.9044 4.51121L17.2893 5.33615C18.4536 6.02973 19.2752 6.52034 19.8781 6.9739C20.4665 7.41662 20.7888 7.78294 20.9883 8.19917C21.1877 8.61505 21.2706 9.09337 21.2457 9.82469C21.2201 10.5745 21.0856 11.5163 20.8936 12.8511L20.6148 14.7884C20.3683 16.5016 20.1921 17.7162 19.939 18.633C19.6916 19.5289 19.3939 20.0476 18.9616 20.4198C18.5287 20.7926 17.9676 21.0127 17.037 21.1294C16.086 21.2486 14.8488 21.25 13.1061 21.25H10.8939C9.15124 21.25 7.91405 21.2486 6.963 21.1294C6.03246 21.0127 5.47129 20.7926 5.03841 20.4198C4.60614 20.0476 4.30838 19.5289 4.06102 18.633C3.80791 17.7162 3.6317 16.5016 3.3852 14.7884L3.10643 12.851C2.91437 11.5163 2.77991 10.5745 2.75432 9.82469C2.72937 9.09337 2.81229 8.61505 3.01167 8.19917C3.21121 7.78294 3.53347 7.41662 4.12194 6.9739C4.72482 6.52034 5.54643 6.02973 6.71074 5.33615L8.09558 4.51121Z"
              fill="#1C274C"></path>
    </svg>
  ]

  const settings = [
    // eslint-disable-next-line react/jsx-key
    <svg width="20"
         height="20" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" fill="none">
      <path fill="#A3842E"
            d="m80.16 29.054-5.958-.709 5.958.71Zm31.68 0-5.958.71 5.958-.71Zm34.217 19.756-2.365-5.515 2.365 5.514Zm10.081 3.352 5.196-3-5.196 3Zm7.896 13.676 5.196-3-5.196 3Zm-2.137 10.407-3.594-4.805 3.594 4.805Zm0 39.51 3.593-4.805-3.593 4.805Zm2.137 10.407 5.196 3-5.196-3Zm-7.896 13.676-5.196-3 5.196 3Zm-10.081 3.353 2.364-5.515-2.364 5.515Zm-34.217 19.755 5.958.709-5.958-.709Zm-31.68 0-5.958.709 5.958-.709Zm-34.217-19.755-2.364-5.515 2.364 5.515Zm-10.08-3.353-5.197 3 5.196-3Zm-7.897-13.676 5.196-3-5.196 3Zm2.137-10.407 3.594 4.805-3.594-4.805Zm0-39.51L26.51 81.05l3.593-4.805Zm-2.137-10.407 5.196 3-5.196-3Zm7.896-13.676-5.196-3 5.196 3Zm10.081-3.352-2.364 5.514 2.364-5.514Zm7.85 3.365-2.365 5.515 2.364-5.515Zm0 87.65 2.364 5.514-2.365-5.514ZM36.235 111.17l-3.594-4.805 3.594 4.805Zm76.823 41.535 5.958.71-5.958-.71Zm39.854-69.742-3.593-4.805 3.593 4.805Zm-16.369-30.074 2.364 5.514-2.364-5.514Zm-23.485-13.594-5.958.709 5.958-.71ZM88.104 16a14 14 0 0 0-13.902 12.345l11.916 1.419A2 2 0 0 1 88.104 28V16Zm15.792 0H88.104v12h15.792V16Zm13.902 12.345A14 14 0 0 0 103.896 16v12a2 2 0 0 1 1.986 1.764l11.916-1.419Zm1.219 10.24-1.219-10.24-11.916 1.419 1.219 10.24 11.916-1.419Zm24.675 4.71-9.513 4.08 4.729 11.028 9.513-4.08-4.729-11.028Zm17.642 5.867a14 14 0 0 0-17.642-5.867l4.729 11.029a2 2 0 0 1 2.521.838l10.392-6Zm7.896 13.676-7.896-13.676-10.392 6 7.896 13.676 10.392-6Zm-3.74 18.212a14 14 0 0 0 3.74-18.212l-10.392 6a2 2 0 0 1-.535 2.602l7.187 9.61Zm-8.984 6.718 8.984-6.718-7.187-9.61-8.983 6.718 7.186 9.61Zm8.984 23.182-8.984-6.718-7.186 9.61 8.983 6.718 7.187-9.61Zm3.74 18.212a14 14 0 0 0-3.74-18.212l-7.187 9.61a2 2 0 0 1 .535 2.602l10.392 6Zm-7.896 13.676 7.896-13.676-10.392-6-7.896 13.676 10.392 6Zm-17.642 5.867a14 14 0 0 0 17.642-5.867l-10.392-6a2.001 2.001 0 0 1-2.521.838l-4.729 11.029Zm-9.513-4.08 9.513 4.08 4.729-11.029-9.512-4.079-4.73 11.028Zm-16.381 19.03 1.219-10.24-11.916-1.419-1.219 10.24 11.916 1.419ZM103.896 176a14 14 0 0 0 13.902-12.345l-11.916-1.419a2 2 0 0 1-1.986 1.764v12Zm-15.792 0h15.792v-12H88.104v12Zm-13.902-12.345A14 14 0 0 0 88.104 176v-12a2 2 0 0 1-1.986-1.764l-11.916 1.419Zm-1.012-8.504 1.012 8.504 11.916-1.419-1.012-8.504-11.916 1.419ZM51.428 134.31l-7.85 3.366 4.73 11.029 7.849-3.366-4.73-11.029Zm-7.85 3.366a2 2 0 0 1-2.52-.838l-10.392 6a14 14 0 0 0 17.642 5.867l-4.73-11.029Zm-2.52-.838-7.896-13.676-10.392 6 7.896 13.676 10.392-6Zm-7.896-13.676a2 2 0 0 1 .535-2.602l-7.187-9.61a14 14 0 0 0-3.74 18.212l10.392-6Zm.535-2.602 6.132-4.585-7.187-9.61-6.132 4.585 7.187 9.61ZM26.51 81.05l6.132 4.586 7.187-9.61-6.132-4.586-7.187 9.61Zm-3.74-18.212a14 14 0 0 0 3.74 18.212l7.187-9.61a2 2 0 0 1-.535-2.602l-10.392-6Zm7.896-13.676L22.77 62.838l10.392 6 7.896-13.676-10.392-6Zm17.642-5.867a14 14 0 0 0-17.642 5.867l10.392 6a2 2 0 0 1 2.52-.838l4.73-11.029Zm7.849 3.366-7.85-3.366-4.729 11.029 7.85 3.366 4.729-11.029Zm18.045-18.316-1.012 8.504 11.916 1.419 1.012-8.504-11.916-1.419Zm-1.754 27.552c6.078-3.426 11.69-9.502 12.658-17.63L73.19 36.85c-.382 3.209-2.769 6.415-6.635 8.595l5.893 10.453Zm-21.02 1.793c7.284 3.124 15.055 1.57 21.02-1.793l-5.893-10.453c-3.704 2.088-7.481 2.468-10.398 1.217l-4.73 11.029ZM49 96c0-7.1-2.548-15.022-9.171-19.975l-7.187 9.61C35.36 87.668 37 91.438 37 96h12Zm23.448 40.103c-5.965-3.363-13.736-4.917-21.02-1.793l4.729 11.029c2.917-1.251 6.694-.871 10.398 1.218l5.893-10.454Zm-32.62-20.128C46.452 111.022 49 103.1 49 96H37c0 4.563-1.64 8.333-4.358 10.365l7.187 9.61Zm78.679 19.575c-5.536 3.298-10.517 8.982-11.406 16.446l11.916 1.419c.329-2.765 2.318-5.582 5.632-7.557l-6.142-10.308Zm20.402-1.953c-7.094-3.042-14.669-1.463-20.402 1.953l6.142 10.308c3.382-2.015 6.872-2.372 9.53-1.233l4.73-11.028Zm-53.803 20.135c-.968-8.127-6.58-14.202-12.658-17.629l-5.893 10.454c3.866 2.179 6.253 5.385 6.635 8.594l11.916-1.419ZM141 96c0 6.389 2.398 13.414 8.32 17.842l7.186-9.61C154.374 102.638 153 99.668 153 96h-12Zm8.32-17.842C143.398 82.586 141 89.61 141 96h12c0-3.668 1.374-6.638 3.506-8.232l-7.186-9.61ZM118.507 56.45c5.733 3.416 13.308 4.995 20.401 1.953l-4.729-11.029c-2.658 1.14-6.148.782-9.53-1.233l-6.142 10.31Zm-11.406-16.446c.889 7.464 5.87 13.148 11.406 16.446l6.142-10.309c-3.314-1.974-5.303-4.79-5.632-7.556l-11.916 1.419Z"></path>
        <path stroke="#A3842E"
              d="M96 120c13.255 0 24-10.745 24-24s-10.745-24-24-24-24 10.745-24 24 10.745 24 24 24Z"></path>
    </svg>
  ];

  const profile = [
    <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        key={0}
    >
      <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM12 7C12 8.10457 11.1046 9 10 9C8.89543 9 8 8.10457 8 7C8 5.89543 8.89543 5 10 5C11.1046 5 12 5.89543 12 7ZM9.99993 11C7.98239 11 6.24394 12.195 5.45374 13.9157C6.55403 15.192 8.18265 16 9.99998 16C11.8173 16 13.4459 15.1921 14.5462 13.9158C13.756 12.195 12.0175 11 9.99993 11Z"
          fill="#A3842E"
      ></path>
    </svg>,
  ];

  return (
      <>
        <hr/>
        <Menu theme="light" mode="inline">
          <Menu.Item key="1">
            <NavLink to="/">
            <span
                className="icon"
                style={{
                  background: page === "" ? '#a3842ed9' : "",
                }}
            >
              {home}
            </span>
              <span className="label">Главная</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="2">
            <NavLink to="/reservation">
            <span
                className="icon"
                style={{
                  background: page === "reservation" ? '#a3842ed9' : "",
                }}
            >
              {tables}
            </span>
              <span className="label">Бронирование</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="5">
            <NavLink to="/product">
            <span
                className="icon"
                style={{
                  background: page === "product" ? '#a3842ed9' : "",
                }}
            >
              {gamesIcon}
            </span>
              <span className="label">Продукция</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="3">
            <NavLink to="/feedback">
            <span
                className="icon"
                style={{
                  background: page === "feedback" ? '#a3842ed9' : "",
                }}
            >
              {reviews}
            </span>
              <span className="label">Отзывы</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="3">
            <NavLink to="/chatGPT">
            <span
                className="icon"
                style={{
                  background: page === "chatGPT" ? '#a3842ed9' : "",
                }}
            >
              {chatGpt}
            </span>
              <span className="label">ChatGPT</span>
            </NavLink>
          </Menu.Item>
          {/*chatGPT*/}
          <Menu.Item key="4">
            <NavLink to="/users">
            <span
                className="icon"
                style={{
                  background: page === "users" ? '#a3842ed9' : "",
                }}
            >
              {telegramUserIcon}
            </span>
              <span className="label">Пользователи</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="6">
            <NavLink to="/filling">
            <span
                className="icon"
                style={{
                  background: page === "filling" ? '#a3842ed9' : "",
                }}
            >
              {language}
            </span>
              <span className="label">Переводы</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="7">
            <NavLink to="/mailing">
            <span
                className="icon"
                style={{
                  background: page === "mailing" ? '#a3842ed9' : "",
                }}
            >
              {settings}
            </span>
              <span className="label">Рассылка</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="8">
            <NavLink to="/profile">
            <span
                className="icon"
                style={{
                  background: page === "profile" ? '#a3842ed9' : "",
                }}
            >
              {profile}
            </span>
              <span className="label">Пользователь</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="9">
            <NavLink onClick={Logout} to="/sign-in">
            <span
                className="icon"
                style={{
                  background: "#8B1919",
                }}
            >
                {logout}
            </span>
              <span className="label">Logout</span>
            </NavLink>
          </Menu.Item>
        </Menu>
      </>
  );
}

export default Sidenav;
