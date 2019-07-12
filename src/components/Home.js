import React from 'react';
import Mix from './Mix';
const Home = ({mixes, ...props}) => (
	<div className='flex flex-wrap justify-between mixes ph3 ph4-1'>

		{mixes.slice(0,6).map(mix => (

			<div className='mix mb4'>
			{/*. Here we pass props straight through*/}
				<Mix {...props} {...mix} id={mix.key} />
			</div>
		))}
		
	
	</div>
);

export default Home;
