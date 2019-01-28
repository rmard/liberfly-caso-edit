class Helpers {

	static calculaValorEsperado = (assuntos) => {
		var ret = 0;
		assuntos.forEach((a)=>{
            if(a==="atrasoate4")
                ret += 4000;
            if(a==="atrasomaior4")
                ret += 4000;
            if(a==="cancelamentoclima")
                ret += 3500;
            if(a==="cancelamentooperacionais")
                ret += 3500;
            if(a==="cancelamentotripulacao")
                ret += 3500;
            if(a==="cancelamentosemmotivo")
                ret += 3500;    
            if(a==="overbooking")
                ret += 2500;    
            if(a==="reembolso")
                ret += 1500;      
            if(a==="extraviobagagemtemporario")
                ret += 5000;
            if(a==="extraviobagagemdefinitivo")
                ret += 10000;
            if(a==="noshow")
                ret += 4000;
            if(a==="danobagagem")
                ret += 2000;      
            if(a==="falhaprestacao")
                ret += 2500;    
		});
		return ret;
	}
}

export default Helpers;