import React from 'react'

const Detail = (props) => {
	console.log(props)
	return (

		<div>{`hi my id is ${props.params.id}`}</div>

	)

}

export default Detail