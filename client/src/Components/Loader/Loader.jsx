import React, {useState} from 'react';
import {animated, useChain, useSpring, useSpringRef} from "react-spring";

import './loader.scss'

const Loader = () => {
    const [hidden, setHidden] = useState(false);

    const springApi1 = useSpringRef();
    const springProps1 = useSpring({
        from: {strokeDashoffset: 6000, fillOpacity: 0},
        to: {strokeDashoffset: 0, fillOpacity: 1},
        config: {duration: 3000},
        ref: springApi1
    });

    const springApi2 = useSpringRef();
    const springProps2 = useSpring({
        from: {fillOpacity: 0},
        to: {fillOpacity: 1},
        config: {duration: 1200},
        ref: springApi2,
        onResolve: () => {
            const timeoutId = setTimeout(() => {
                setHidden(true);
            }, 600);

            return () => clearTimeout(timeoutId);
        }
    });

    useChain([springApi1, springApi2], [0, 0.5]);

    return (
            <div className={`loader ${hidden ? 'hidden' : ''}`}>
                <svg width="300" height="300" viewBox="0 0 500 500">
                    <g transform="translate(0.000000,500.000000) scale(0.100000,-0.100000)" fill="#ffffff"
                       stroke="none">
                        <animated.path
                            d="M2185 3933 c-264 -156 -661 -416 -850 -558 -146 -110 -430 -346 -548 -455 -71 -66 -97 -110 -64 -110 6 0 61 39 121 85 376 294 916 628 1527 945 l66 34 239 -129 c568 -305 922 -525 1282 -797 101 -76 188 -138 193 -138 5 0 9 9 9 19 0 36 -335 328 -625 546 -257 193 -618 427 -988 639 -54 31 -106 56 -115 55 -9 0 -120 -61 -247 -136z"
                            stroke="#ffffff"
                            strokeWidth="3"
                            fill="#ffffff"
                            fillOpacity={springProps2.fillOpacity}
                            style={{
                                strokeDashoffset: springProps1.strokeDashoffset,
                                strokeDasharray: 1000,
                            }}
                        />
                        // top line
                        <animated.path
                            d="M2335 3766 c-527 -280 -615 -329 -615 -342 0 -11 15 -8 68 12 218 83 615 224 631 224 19 0 460 -181 747 -306 143 -63 266 -114 272 -114 7 0 12 4 12 9 0 8 -314 192 -515 301 -33 18 -158 86 -277 151 -119 66 -218 119 -220 119 -2 0 -48 -24 -103 -54z"
                            stroke="#c6ac47"
                            strokeWidth="3"
                            fill="#c6ac47"
                            fillOpacity={springProps2.fillOpacity}
                            style={{
                                strokeDashoffset: springProps1.strokeDashoffset,
                                strokeDasharray: 1000,
                            }}
                        /> // top line

                        <animated.path
                            d="M255 2978 c-8 -23 -44 -301 -50 -393 -8 -100 7 -228 33 -281 17 -36 69 -67 105 -62 17 2 24 12 29 43 49 278 57 315 74 315 30 0 30 -41 -2 -367 -10 -103 31 -173 102 -173 40 0 47 10 34 46 -14 35 -15 100 -5 304 l7 165 -23 21 c-25 22 -79 44 -110 44 -26 0 -44 -41 -83 -182 -18 -66 -35 -117 -38 -112 -24 42 -14 218 25 449 12 72 21 137 19 147 -3 16 -68 48 -98 48 -8 0 -17 -6 -19 -12z"
                            stroke="#ffffff"
                            strokeWidth="3"
                            fill="#ffffff"
                            fillOpacity={springProps2.fillOpacity}
                            style={{
                                strokeDashoffset: springProps1.strokeDashoffset,
                                strokeDasharray: 1000,
                            }}
                        /> // H
                        <animated.path
                            d="M646 2654 c-18 -257 -18 -308 1 -343 20 -39 55 -67 94 -76 24 -6 27 -3 32 32 3 21 19 67 35 103 l31 65 0 -38 c2 -81 51 -137 120 -137 29 0 30 1 23 33 -9 42 -9 179 1 244 7 48 6 53 -17 68 -13 9 -44 17 -68 18 l-43 2 -6 -60 c-5 -52 -35 -141 -80 -238 -12 -26 -14 -27 -20 -10 -12 30 -9 143 6 228 30 162 30 150 0 169 -15 10 -44 21 -65 23 l-37 5 -7 -88z"
                            stroke="#ffffff"
                            strokeWidth="3"
                            fill="#ffffff"
                            fillOpacity={springProps2.fillOpacity}
                            style={{
                                strokeDashoffset: springProps1.strokeDashoffset,
                                strokeDasharray: 1000,
                            }}
                        /> // U
                        <animated.path
                            d="M1056 2938 c-14 -66 -28 -186 -33 -293 -12 -248 45 -395 152 -395 30
                        0 30 0 8 44 -16 34 -15 39 6 118 47 170 105 278 134 249 17 -17 22 -225 7
                        -295 -13 -62 -51 -116 -81 -116 -23 0 -25 -16 -3 -24 34 -13 92 -5 125 17 50
                        32 80 101 86 194 10 147 -27 246 -103 272 -83 29 -122 -20 -171 -211 -14 -60
                        -30 -108 -33 -108 -23 0 -16 273 10 411 6 29 10 67 10 86 0 30 -5 36 -42 53
                        -55 25 -67 25 -72 -2z"
                            stroke="#ffffff"
                            strokeWidth="3"
                            fill="#ffffff"
                            fillOpacity={springProps2.fillOpacity}
                            style={{
                                strokeDashoffset: springProps1.strokeDashoffset,
                                strokeDasharray: 1000,
                            }}
                        /> // B
                        <animated.path
                            d="M1511 2886 c-24 -163 -32 -301 -22 -389 14 -119 29 -164 72 -209 29
                        -31 43 -38 73 -38 l36 0 -20 40 -20 39 35 117 c40 129 62 179 95 209 18 16 23
                        17 30 5 16 -26 23 -101 17 -194 -9 -139 -42 -216 -96 -216 -25 -1 -25 -1 -7
                        -15 23 -18 79 -20 109 -4 75 39 111 117 111 244 0 137 -43 225 -116 239 -53
                        10 -86 -7 -108 -57 -17 -38 -55 -166 -76 -252 l-7 -30 -10 35 c-12 44 -2 262
                        18 393 8 54 12 103 9 109 -7 11 -83 47 -100 48 -7 0 -16 -32 -23 -74z"
                            stroke="#ffffff"
                            strokeWidth="3"
                            fill="#ffffff"
                            fillOpacity={springProps2.fillOpacity}
                            style={{
                                strokeDashoffset: springProps1.strokeDashoffset,
                                strokeDasharray: 1000,
                            }}
                        /> // B
                        <animated.path
                            d="M2014 3053 c-14 -10 -53 -353 -61 -528 -6 -144 7 -217 52 -283 27
                    -39 71 -72 98 -72 22 0 21 3 -4 70 -33 88 -35 202 -5 473 31 284 31 299 8 320
                    -21 20 -72 31 -88 20z"
                            stroke="#ffffff"
                            strokeWidth="3"
                            fill="#ffffff"
                            fillOpacity={springProps2.fillOpacity}
                            style={{
                                strokeDashoffset: springProps1.strokeDashoffset,
                                strokeDasharray: 1000,
                            }}
                        /> // L
                        <animated.path
                            d="M2205 2748 c-51 -29 -104 -141 -112 -236 -5 -60 -2 -77 17 -117 39
                        -80 138 -134 221 -120 52 9 129 77 129 113 l-1 27 -20 -28 c-44 -58 -121 -75
                        -160 -34 -29 30 -59 96 -59 131 0 28 1 28 40 22 53 -8 104 13 124 53 10 17 16
                        55 16 91 0 51 -4 65 -25 85 -20 21 -33 25 -87 25 -35 0 -72 -6 -83 -12z m136
                        -79 c33 -62 -44 -169 -101 -139 -14 8 -17 16 -11 42 22 94 84 148 112 97z"
                            stroke="#ffffff"
                            strokeWidth="3"
                            fill="#ffffff"
                            fillOpacity={springProps2.fillOpacity}
                            style={{
                                strokeDashoffset: springProps1.strokeDashoffset,
                                strokeDasharray: 1000,
                            }}
                        /> // E
                        <animated.path
                            d="M2477 2953 c-17 -27 -39 -299 -34 -423 5 -122 8 -140 33 -188 31 -60 68 -91 119 -99 38 -6 41 0 20 37 -21 38 -18 76 16 185 36 114 58 162 88 189 20 18 21 18 32 -10 15 -39 7 -267 -12 -319 -9 -24 -26 -47 -46 -60 -49 -31 -42 -45 22 -45 47 0 59 4 91 32 59 52 74 96 74 223 0 95 -3 117 -24 162 -27 57 -64 83 -119 83 -22 0 -41 -8 -55 -23 -24 -25 -59 -120 -87 -237 -14 -56 -20 -70 -26 -55 -13 34 -10 186 8 315 23 177 23 189 -7 211 -29 22 -85 35 -93 22z"
                            stroke="#c6ac47"
                            strokeWidth="3"
                            fill="#c6ac47"
                            fillOpacity={springProps2.fillOpacity}
                            style={{
                                strokeDashoffset: springProps1.strokeDashoffset,
                                strokeDasharray: 1000,
                            }}
                        /> // B
                        <animated.path
                            d="M2916 2643 c-19 -293 -19 -286 0 -328 21 -43 74 -85 109 -85 19 0 23 7 28 43 4 23 17 63 31 89 l24 47 7 -37 c11 -57 31 -88 70 -106 46 -22 81 -18 77 9 -10 82 -12 171 -5 233 12 92 0 111 -71 119 -57 7 -66 -2 -66 -64 0 -39 -20 -103 -65 -207 -13 -30 -19 -36 -26 -25 -14 23 -10 109 11 234 11 64 20 121 20 126 0 18 -65 49 -101 49 l-36 0 -7 -97z"
                            stroke="#c6ac47"
                            strokeWidth="3"
                            fill="#c6ac47"
                            fillOpacity={springProps2.fillOpacity}
                            style={{
                                strokeDashoffset: springProps1.strokeDashoffset,
                                strokeDasharray: 1000,
                            }}
                        /> // U
                        <animated.path
                            d="M3333 2948 c-26 -35 -50 -370 -34 -483 16 -111 50 -178 105 -204 45 -23 76 -27 76 -11 0 5 -8 25 -17 44 -16 34 -15 39 16 148 46 164 96 249 121 208 17 -28 23 -142 11 -228 -15 -102 -40 -157 -76 -166 -42 -11 -23 -31 31 -34 103 -6 165 76 172 228 8 158 -47 270 -133 270 -20 0 -45 -5 -57 -11 -27 -15 -62 -96 -90 -212 -13 -53 -26 -97 -30 -97 -13 0 -8 250 7 360 22 159 22 158 -27 180 -51 23 -62 24 -75 8z"
                            stroke="#c6ac47"
                            strokeWidth="3"
                            fill="#c6ac47"
                            fillOpacity={springProps2.fillOpacity}
                            style={{
                                strokeDashoffset: springProps1.strokeDashoffset,
                                strokeDasharray: 1000,
                            }}
                        /> // B
                        <animated.path
                            d="M3797 2952 c-14 -21 -37 -264 -37 -377 0 -135 15 -206 55 -267 25 -37 74 -68 110 -68 17 0 21 35 4 46 -30 18 29 254 85 336 44 67 63 36 65 -104 2 -141 -26 -238 -74 -260 -43 -20 -31 -38 26 -38 115 0 172 83 172 250 0 163 -50 250 -144 250 -19 0 -43 -6 -52 -12 -24 -19 -61 -110 -87 -215 -12 -51 -26 -90 -31 -87 -15 9 -10 188 8 329 22 175 22 174 -7 196 -30 22 -85 35 -93 21z"
                            stroke="#c6ac47"
                            strokeWidth="3"
                            fill="#c6ac47"
                            fillOpacity={springProps2.fillOpacity}
                            style={{
                                strokeDashoffset: springProps1.strokeDashoffset,
                                strokeDasharray: 1000,
                            }}
                        /> // B
                        <animated.path
                            d="M4281 3038 c-15 -39 -56 -457 -55 -568 0 -75 5 -120 18 -159 23 -67 91 -141 129 -141 33 0 33 4 5 66 -21 45 -23 62 -22 219 1 94 6 202 12 240 6 39 17 126 24 194 l12 124 -29 23 c-39 31 -82 32 -94 2z"
                            stroke="#c6ac47"
                            strokeWidth="3"
                            fill="#c6ac47"
                            fillOpacity={springProps2.fillOpacity}
                            style={{
                                strokeDashoffset: springProps1.strokeDashoffset,
                                strokeDasharray: 1000,
                            }}
                        /> // L
                        <animated.path
                            d="M4503 2764 c-54 -12 -115 -118 -135 -234 -10 -59 -9 -73 7 -115 43 -113 167 -174 268 -131 59 24 137 135 153 216 10 47 -16 35 -36 -16 -37 -97 -93 -154 -151 -154 -47 0 -109 84 -109 146 0 22 4 24 45 24 93 0 135 47 135 149 0 83 -24 111 -100 116 -30 2 -65 1 -77 -1z m108 -95 c24 -46 -17 -139 -62 -139 -37 0 -49 11 -43 39 15 61 56 119 86 121 4 0 12 -10 19 -21z"
                            stroke="#c6ac47"
                            strokeWidth="3"
                            fill="#c6ac47"
                            fillOpacity={springProps2.fillOpacity}
                            style={{
                                strokeDashoffset: springProps1.strokeDashoffset,
                                strokeDasharray: 1000,
                            }}
                        /> // E

                        <animated.path
                            d="M1440 1756 c0 -25 956 -559 1000 -559 14 1 99 40 190 89 91 48 246 131 344 184 166 88 211 120 173 120 -8 0 -68 -20 -134 -44 -256 -96 -538 -196 -553 -196 -31 0 -489 190 -927 384 -92 41 -93 41 -93 22z"
                            stroke="#c6ac47"
                            strokeWidth="3"
                            fill="#c6ac47"
                            fillOpacity={springProps2.fillOpacity}
                            style={{
                                strokeDashoffset: springProps1.strokeDashoffset,
                                strokeDasharray: 1000,
                            }}
                        />
                        <animated.path
                            d="M710 2183 c2 -32 87 -113 340 -325 347 -291 714 -543 1214 -833 151 -87 173 -97 196 -88 48 18 492 284 668 400 335 220 582 409 872 664 146 128 183 170 165 187 -9 9 -31 -6 -207 -139 -252 -192 -552 -388 -863 -566 -210 -120 -642 -353 -653 -353 -6 0 -136 68 -289 151 -559 304 -882 506 -1242 778 -158 119 -202 146 -201 124z"
                            stroke="#ffffff"
                            strokeWidth="3"
                            fill="#ffffff"
                            fillOpacity={springProps2.fillOpacity}
                            style={{
                                strokeDashoffset: springProps1.strokeDashoffset,
                                strokeDasharray: 1000,
                            }}
                        />
                    </g>
                </svg>
            </div>
    );
};

export default Loader;