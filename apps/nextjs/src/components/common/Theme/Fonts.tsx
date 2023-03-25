import React from 'react';

import { Global } from '@emotion/react';

const Fonts = () => {
	return (
		<Global
			styles={`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;600&display=swap');
      `}
		/>
	);
};

export default Fonts;
