export function Atmosphere() {
  return (
    <div className="spatial-field" aria-hidden="true">
      <div className="spatial-plane spatial-plane--far">
        <span className="ink-sun" />
        <span className="ink-haze ink-haze--jade" />
        <span className="ink-haze ink-haze--brass" />
      </div>

      <svg className="spatial-plane spatial-plane--mid ink-landscape" viewBox="0 0 1600 1000" preserveAspectRatio="none">
        <path className="ink-ridge ink-ridge--far" d="M-80 690C95 632 177 516 329 548C461 576 508 688 657 665C801 643 835 512 1012 512C1167 512 1238 630 1397 606C1484 593 1555 546 1680 480V1080H-80Z" />
        <path className="ink-ridge ink-ridge--near" d="M-80 805C105 752 244 691 392 724C543 758 642 851 789 809C944 766 986 648 1155 670C1323 691 1420 795 1680 713V1080H-80Z" />
      </svg>

      <svg className="spatial-plane spatial-plane--near ink-contours" viewBox="0 0 1600 1000" preserveAspectRatio="none" fill="none">
        <path d="M-90 745C176 562 331 713 531 586C744 450 855 573 1043 457C1239 336 1368 448 1690 244" />
        <path d="M-80 793C189 620 357 774 561 635C769 494 904 621 1091 505C1274 391 1420 495 1690 330" />
        <path d="M-70 843C224 683 389 830 612 684C823 545 955 683 1166 556C1354 443 1488 558 1690 437" />
        <path d="M236 1064C310 827 512 858 611 697C735 497 844 469 1038 445" />
      </svg>

      <span className="spatial-vignette" />
    </div>
  )
}
