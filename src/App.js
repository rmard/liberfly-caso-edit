import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string';
import { Modal, ProgressBar, Input, Row, Col } from 'react-materialize';
import AirlinesSelector from './AirlinesSelector'
import Helpers from './Helpers'

const debounce = (fn, delay) => {
  let timer = null;
  return function (...args) {
      const context = this;
      timer && clearTimeout(timer);
      timer = setTimeout(() => {
          fn.apply(context, args);
      }, delay);
  };
}

const readableNumber = (n) => {
  let r = 'R$ '+n.toFixed(2);
  return r.replace('.', ',');
}

const formatNumber = (n) => {
  let r = n.replace('R$ ', '');
  r = r.replace(',', '');
  r = r/100;
  return parseFloat(r);
}

class App extends Component {
  state = {
    id: 0,
    loading: false,
    obs_visivel: '',
    origem: '',
    origem2: '',
    pais: '',
    autoridade_comp: '',
    reg_reclamacao: '',
    companhia_aerea: '',
    lista_empresas: '',
    lista_empresas_server: '',
    intermediadora: '',
    assunto: [],
    prev_envio_docs: '',
    motivo: '',
    aeroporto_origem: '',
    aeroporto_destino: '',
    valor_esperado: 0,
    isCd: false,
    valor_cd: 0,
    resumo: '',
    created: '',
  }
  serverUpdate = (key, val) => {
    this.setState({loading: true});
    let formdata = new FormData();
    formdata.append(key, val);
    fetch('https://sistema.liberfly.com.br/casos/reactedit/'+this.state.id+'.json', {
      method: "POST",
      body: formdata
    })
    .then((res)=>{
      this.setState({loading: false});
      if(res.status!==200)
        alert('Ocorreu um erro ao tentar salvar o campo '+key);
    })
    .catch((res)=>{
      this.setState({loading: false});
    })    
  }
  handleChange = (e) => {
    var obj = {};
    let val;
    let key = e.target.name;
    if(key==='assunto') {
      val = [];
      [...e.target.options].forEach((opt)=>{
        if(opt.selected && opt.value!=='')
          val.push(opt.value);
      })
      obj['valor_esperado'] = (Helpers.calculaValorEsperado(val));
      this.serverUpdate('valor_esperado', Helpers.calculaValorEsperado(val));
      this.calculaValorCd(obj['valor_esperado']);
    }
    else if(key==='prev_envio_docs')
      val = ((new Date(e.target.value).toISOString())+' ').substr(0,10);
    else if(key==='valor_esperado') {
      val = formatNumber(e.target.value);   
      this.calculaValorCd(val);
    }
    else if(key==='valor_cd')
      val = formatNumber(e.target.value);          
    else
      val = e.target.value;
    obj[key] = val;
    this.setState(obj);
    this.serverUpdate(key, val);
  }
  constructor(props) {
    super(props);
    this.serverUpdate = debounce(this.serverUpdate, 600);
  }  
  componentDidMount() {
    const query = queryString.parse(window.location.search);
    this.setState({loading: true, id: query.caso});
    window.casoid = query.caso;
    fetch('https://sistema.liberfly.com.br/empresas/lista.json')
      .then(res=>res.json())
      .then(data=>{
        this.setState({lista_empresas_server: data.lista_empresas});
      })

    fetch('https://sistema.liberfly.com.br/casos/reactedit/'+query.caso+'.json')
      .then(res=>res.json())
      .then(data=>{
        this.setState(data.caso);
        this.setState({assunto: data.caso.assunto.split(',')});
        if(data.caso.prev_envio_docs!==null)
          this.setState({prev_envio_docs: (data.caso.prev_envio_docs).substr(0,10)});
        if(data.caso.valor_cd!==0)
          this.setState({isCd: true});
        this.setState({loading: false});
        [...document.getElementsByTagName('label')].forEach(function(e){e.className='active'});
        window.materialselect();
      });
  }
  calculaValorCd = (ve) => {
    setTimeout(()=>{
      if(this.state.isCd) {
        if(ve!==undefined) {
          this.setState((prev)=>({valor_cd: (ve)/4}));
        }
        else
          this.setState((prev)=>({valor_cd: (prev.valor_esperado)/4}));
        setTimeout(()=>{
          this.serverUpdate('valor_cd', this.state.valor_cd);
        }, 500);        
      }
    }, 1000);
  }  
  render() {
    const { 
      loading, 
      obs_visivel, 
      origem, 
      origem2, 
      pais,
      autoridade_comp,
      reg_reclamacao,
      companhia_aerea,
      lista_empresas,
      lista_empresas_server,
      intermediadora,
      assunto,
      prev_envio_docs,
      motivo,
      aeroporto_origem,
      aeroporto_destino,
      valor_esperado,
      valor_cd,
      resumo,
      created,
      isCd,
    } = this.state;
    return (
      <div>
        <Modal
          id='airlines-selector'
          header='Modal Header'>
          Lorem ipsum dolor sit amet
        </Modal>      
        <Row>
          {loading ? (
            <Col s={12}>
              <ProgressBar />
            </Col>            
          ) : (
            <div className='progressBarSpace'>
            </div>
          )}
          <Input 
            placeholder="Ficará em destaque"
            m={2}
            label="Obs. visível"
            value={obs_visivel}
            name="obs_visivel"
            onChange={this.handleChange}
          />
          <Input
            type='select'
            m={2}
            label='Origem da captação*'
            value={origem}
            name='origem'
            onChange={this.handleChange}
          >
            <option disabled></option>
            <option>Site</option>
            <option>Instagram</option>
            <option>Facebook</option>
            <option>Indicação</option>
            <option>Google</option>
            <option>Outra</option>
          </Input>
          <Input 
            m={2}
            label="Blogueiro(a)/Influenciador"
            value={origem2}
            name="origem2"
            onChange={this.handleChange}
          />
          <Input 
            m={2}
            label="País da reclamação"
            value={pais}
            name="pais"
            onChange={this.handleChange}
          /> 
          <Input 
            m={2}
            label="Autoridade Nac. Competente"
            value={autoridade_comp}
            name="autoridade_comp"
            onChange={this.handleChange}
          /> 
          <Input 
            m={2}
            label="Nº reg. reclamação"
            value={reg_reclamacao}
            name="reg_reclamacao"
            onChange={this.handleChange}
          />     
          <Modal
            header='Companhias aéreas'
            trigger={
              <Input 
                m={3}
                disabled={true}
                label="Cia(s) Aérea **"
                value={companhia_aerea}
                name="companhia_aerea"
                readOnly={true}
                onChange={this.handleChange}
                onClick={(e)=>{
                  //document.getElementById('airlines-selector').modal('open')
                  e.preventDefault();
                  e.target.blur();
                  // window.open("https://sistema.liberfly.com.br/casos/seleciona_cias?cias="+companhia_aerea, 'seleciona_cias','menubar=1,resizable=1,width=600,height=320');
                }}
              />               
            }>
            <AirlinesSelector
              fieldName='companhia_aerea'
              options={false}
              value={companhia_aerea}
              handleChange={this.handleChange}
            />
          </Modal>    
          <Input
            disabled={true}
            type='select'
            m={3}
            label='Intermediadora'
            value={intermediadora}
            name='intermediadora'
            onChange={this.handleChange}
          >
            <option></option>
            <option>123Milhas</option>
            <option>Booking</option>
            <option>CVC</option>
            <option>Decolar</option>
            <option>eDreams</option>
            <option>MaxMilhas</option>
            <option>MultiPlus</option>
            <option>Submarino</option>
            <option>TourHouse</option>
            <option>ViajaNet</option>
            <option>Visa</option>            
            <option>Zupper</option>
            <option>{intermediadora}</option>
            <option disabled>Se não constar na lista, solicite a inclusão</option>
          </Input>  
          <Modal
            header='Empresas (novo)'
            trigger={
              <Input 
                m={6}
                label="Empresas (novo)"
                value={lista_empresas}
                name="lista_empresas"
                readOnly={true}
                onChange={this.handleChange}
                onClick={(e)=>{
                  //document.getElementById('airlines-selector').modal('open')
                  e.preventDefault();
                  e.target.blur();
                  // window.open("https://sistema.liberfly.com.br/casos/seleciona_cias?cias="+companhia_aerea, 'seleciona_cias','menubar=1,resizable=1,width=600,height=320');
                }}
              />               
            }>
            <AirlinesSelector
              fieldName='lista_empresas'
              options={lista_empresas_server}
              value={lista_empresas}
              handleChange={this.handleChange}
            />
          </Modal>                                 
          <Input
            type='select'
            m={6}
            label='Assunto**'
            value={assunto}
            name='assunto'
            multiple={true}
            onChange={this.handleChange}
          >
            <option value="" disabled>Selecione</option>
            <option value="atrasoate4">Atraso de voo até 4 horas</option>
            <option value="atrasomaior4">Atraso de voo maior que 4 horas</option>
            <option value="cancelamentoclima">Cancelamento de voo por motivos climáticos</option>
            <option value="cancelamentooperacionais">Cancelamento de voo por problemas operacionais</option>
            <option value="cancelamentotripulacao">Cancelamento de voo por falta de tripulação</option>
            <option value="cancelamentosemmotivo">Cancelamento de voo sem motivo</option>
            <option value="overbooking">Overbooking</option>
            <option value="reembolso">Reembolso</option>
            <option value="milhas">Milhas</option>
            <option value="extraviobagagemtemporario">Extravio de bagagem temporário</option>
            <option value="extraviobagagemdefinitivo">Extravio de bagagem definitivo</option>
            <option value="noshow">No-show</option>
            <option value="danobagagem">Dano em bagagem</option>
            <option value="falhaprestacao">Falha na prestação do serviço</option>
            <option disabled value="outros">Outros</option>
          </Input>    
          <Input 
            value={prev_envio_docs}
            label='Prev. Envio Docs'
            name='prev_envio_docs' 
            type='date' 
            onChange={(e, value)=>{this.handleChange(e);}} 
          />     
          <Input 
            m={4}
            label="Motivo"
            value={motivo}
            name="motivo"
            onChange={this.handleChange}
          />    
          <Input 
            m={2}
            label="Origem*"
            placeholder="AEROPORTO"
            maxLength={3}
            value={aeroporto_origem}
            name="aeroporto_origem"
            onChange={this.handleChange}
          />
          <Input 
            m={2}
            label="Destino*"
            placeholder="AEROPORTO"
            maxLength={3}
            value={aeroporto_destino}
            name="aeroporto_destino"
            onChange={this.handleChange}
          />  
          {isCd ? 
            <Input 
              m={2}
              step='0.01'
              label="Valor compra direito"
              value={readableNumber(valor_cd)}
              name="valor_cd"
              onChange={this.handleChange}
            />   
          :
            <Input 
              m={2}
              name='group1' 
              type='checkbox' 
              value='green' 
              label='Compra direito' 
              className='filled-in' 
              onChange={()=>{this.setState({isCd:true}); this.calculaValorCd()}} 
            />           
          }          
          <Input 
            m={2}
            step='0.01'
            label="Valor esperado"
            value={readableNumber(valor_esperado)}
            name="valor_esperado"
            onChange={this.handleChange}
          />                
          <Input 
            m={12}
            type='textarea'
            label="Resumo"
            value={resumo}
            name="resumo"
            onChange={this.handleChange}
          />    
          <Col m={12}>
            <p className='grey-text' style={{fontSize: '80%'}}>
              Campos marcados com * são de preenchimento obrigatório antes do repasse para o jurídico.<br/>
              Campos marcados com ** são de preenchimento obrigatório antes de entrar na esteira "ajuizada"
            </p>
            {
              /*
            <p className='grey-text right-align'>
              Caso cadastrado por <strong>....</strong> em <strong>{created}</strong>
            </p>
            <p className='red-text right-align'>
              Excluir caso
            </p>
          */}
          </Col>                                   
        </Row>
      </div>
    );
  }
}

export default App;
