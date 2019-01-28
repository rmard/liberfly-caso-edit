import React from 'react'
import airlinesList from './airlinesList'
import { Autocomplete, Chip, Row } from 'react-materialize';
//import { Input } from 'react-materialize';

class AirlinesSelector extends React.Component {
	airlinesChange(action, airline) {
		let list = this.props.value!==''?this.props.value.split(','):[];
		if(action==='add')
			list.push(airline);
		else
			list.splice(list.indexOf(airline), 1);
		let newVal = list.join(',');
		let obj = {
			target: {
				name: this.props.fieldName, //companhia_aerea or lista_empresas
				value: newVal
			},
		};
		this.props.handleChange(obj);
	}
	render = () => {
		const list = this.props.value!==''?this.props.value.split(','):[];
		var opt = {};
		if(this.props.options)
			this.props.options.map((o)=>{opt[o] = null;})
		else
			opt = airlinesList
		//console.log(opt);
		return (
			<div>
				{list.map((v)=>(
					<Chip>
						{v}
						<button onClick={()=>{this.airlinesChange('remove', v)}}>
							X
						</button>
					</Chip>
				))}
				<Row>
				  	<Autocomplete
					    title='Nova cia'
					    data={
					    	opt
					    }
					   	onAutocomplete={val=>{this.airlinesChange('add', val)}}
				  	/>
				</Row>
			</div>
		)
	}
}


export default AirlinesSelector