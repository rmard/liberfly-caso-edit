import React, { Component } from 'react';
import './App.css';
import { Button, ProgressBar, Input, Card, Row, Col, Icon } from 'react-materialize';

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
    loading: false,
    obs_visivel: '',
    origem: '',
    origem2: '',
    pais: '',
    autoridade_comp: '',
    reg_reclamacao: '',
    companhia_aerea: 'Gol',
    intermediadora: '',
    assunto: [],
    prev_envio_docs: '',
    motivo: '',
    aeroporto_origem: '',
    aeroporto_destino: '',
    valor_esperado: 0,
    resumo: '',
    created: '',
  }
  serverUpdate = (obj) => {
    this.setState({loading: true});
    setTimeout(()=>{this.setState({loading: false})}, 500);
  }
  handleChange = (e) => {
    let val;
    //----TODO: Format----//  e assunto
    if(e.target.name==='prev_envio_docs')
      val = e.target.value;
    if(e.target.name==='valor_esperado')
      val = formatNumber(e.target.value);    
    else
      val = e.target.value;
    var obj = {};
    obj[e.target.name] = val;
    this.setState(obj);
    this.serverUpdate(obj);
  }
  constructor(props) {
    super(props);
    this.serverUpdate = debounce(this.serverUpdate, 600);
  }  
  componentDidMount() {
    // window.document.getElementsByClassName('datepicker')[0].pickadate({
    //   selectMonths: true, // Creates a dropdown to control month
    //   selectYears: 15 // Creates a dropdown of 15 years to control year
    // });
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
      intermediadora,
      assunto,
      prev_envio_docs,
      motivo,
      aeroporto_origem,
      aeroporto_destino,
      valor_esperado,
      resumo,
      created,
    } = this.state;
    return (
      <div>
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
          <Input 
            m={3}
            label="Cia(s) Aérea **"
            value={companhia_aerea}
            name="companhia_aerea"
            onChange={this.handleChange}
            onClick={(e)=>{
              e.preventDefault();
              e.target.blur();
              window.open("https://sistema.liberfly.com.br/casos/seleciona_cias?cias="+companhia_aerea, 'seleciona_cias','menubar=1,resizable=1,width=600,height=320');
            }}
          /> 
          <Input 
            m={3}
            label="Intermediadora"
            value={intermediadora}
            name="intermediadora"
            onChange={this.handleChange}
          />       
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
            <option value="atrasoate5">Atraso de voo até 5 horas</option>
            <option value="atrasoate10">Atraso de voo até 10 horas</option>
            <option value="atrasomais10">Atraso de voo superior 10 horas</option>
            <option value="cancelamentoclima">Cancelamento de voo por motivos climáticos</option>
            <option value="cancelamentooperacionais">Cancelamento de voo por problemas operacionais</option>
            <option value="cancelamentotripulacao">Cancelamento de voo por falta de tripulação</option>
            <option value="cancelamentosemmotivo">Cancelamento de voo sem motivo</option>
            <option value="overbooking">Overbooking</option>
            <option value="reembolso">Reembolso</option>
            <option value="milhas">Milhas</option>
            <option value="extraviobagagemate5dias">Extravio de bagagem até 5 dias</option>
            <option value="extraviobagagemate15dias">Extravio de bagagem até 15 dias</option>
            <option value="extraviobagagemsuperior15dias">Extravio de bagagem superior a 15 dias</option>
            <option value="extraviobagagemdefinitivo">Extravio de bagagem definitivo</option>
            <option value="danobagagem">Dano em bagagem</option>
            <option value="outros">Outros</option>
          </Input>    
          <Input 
            value={prev_envio_docs}
            label='Prev. Envio Docs'
            name='prev_envio_docs' 
            type='date' 
            onChange={(e, value)=>{this.handleChange(e);}} />     
          <Input 
            m={4}
            label="Motivo"
            value={motivo}
            name="motivo"
            onChange={this.handleChange}
          />    
          <Input 
            m={2}
            label="Origem"
            placeholder="AEROPORTO"
            value={aeroporto_origem}
            name="aeroporto_origem"
            onChange={this.handleChange}
          />
          <Input 
            m={2}
            label="Destino"
            placeholder="AEROPORTO"
            value={aeroporto_destino}
            name="aeroporto_destino"
            onChange={this.handleChange}
          />  
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
            <p className='grey-text right-align'>
              Caso cadastrado por <strong>....</strong> em <strong>{created}</strong>
            </p>
            <p className='red-text right-align'>
              Excluir caso
            </p>
          </Col>                                   
        </Row>
      </div>
    );
  }
}

export default App;
