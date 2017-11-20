import React from 'react'
import app from './../core/app';

export default (WrappedComponent) => {
	return (props) => {
		return (<WrappedComponent
			app={app}
			{...props}
		/>)
	}
}