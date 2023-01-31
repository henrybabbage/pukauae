import { Global } from '@emotion/react'

const Fonts = () => (
  <Global
	styles={`
		@font-face {
			font-family: 'UntitledSans_Regular';
			src: url('fonts/UntitledSans/UntitledSans_Regular.woff2') format('woff2'),
			url('fonts/UntitledSans/UntitledSans_Regular.woff') format('woff');
			font-style: normal;
			font-weight: 400;
        }
		
        @font-face {
			font-family: 'UntitledSans_Bold';
			src: url('fonts/UntitledSans/UntitledSans_Bold.woff2') format('woff2'),
			url('fonts/UntitledSans/UntitledSans_Bold.woff') format('woff');
			font-style: normal;
			font-weight: 700;
        }

        @font-face {
            font-family: "UntitledSerif_Regular";
            src: url("fonts/UntitledSerif/UntitledSerif_Regular.woff2") format("woff2"),
            url("fonts/UntitledSerif/UntitledSerif_Regular.woff") format("woff");
            font-style: normal;
            font-weight: 400;
        }
        
        @font-face {
            font-family: "UntitledSerif_Bold";
            src: url("fonts/UntitledSerif/UntitledSerif_Bold.woff2") format("woff2"),
            url("fonts/UntitledSerif/UntitledSerif_Bold.woff") format("woff");
            font-style: normal;
            font-weight: 700;
        }
	`}
  	/>
)

export default Fonts