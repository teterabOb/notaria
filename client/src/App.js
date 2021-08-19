import React, { Component } from "react";
import CLPTokenContract from "./contracts/CLPToken.json";
import NotariaContract from "./contracts/Notaria.json";
import ETHChainlink from "./contracts/ETHChainlink.json";
import Web3 from 'web3';
import Navbar from './Navbar';
import Main from './Main';
import "./App.css";


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      documentos: [],
      documentosEmisor: [],
      documentosDestinatario: [],
      montoAutorizado: 0,
      loading: true,
      owner: "0x0000000000000000000000000000000000000000",
      cantTokenUsuario: 0,
      cantTokenContrato: 0,
      precioETH: 0,

    }

    //Se debe bindear para que react sepa que al enviar la funcion
    // al otro js esta siendo la funcion ya creada
    this.nuevoDocumento = this.nuevoDocumento.bind(this)
    this.addDocumentoNotaria = this.addDocumentoNotaria.bind(this)
    this.aceptaDocumento = this.aceptaDocumento.bind(this)
    this.finalizaDocumento = this.finalizaDocumento.bind(this)
  }

  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockChainData();
  }

  async loadWeb3() {

    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()

      await window.web3.currentProvider.on('accountsChanged', (accounts) => {

        this.setState({
          account: accounts[0]

        }, () => {

        })

        this.loadBlockChainData()
      });
    }
    else if (window.web3) {
      //window.web3 = new Web3(window.web3.currentProvider)
      const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/46bacf9bb3c14f039b7072fba6c10455"));
    }
    else {

    }
  }

  setDefaultVariables() {
    this.setState({ documentos: [] })
    this.setState({ documentosPorCliente: [] })
    this.setState({ documentosEmisor: [] })
    this.setState({ documentosDestinatario: [] })
  }

  async loadBlockChainData() {
    let web3 = window.web3

    if (typeof web3 != 'undefined') {
      web3 = new Web3(web3.currentProvider)

    } else {
      web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/46bacf9bb3c14f039b7072fba6c10455"));
    }


    //Carga cuenta
    const accounts = await web3.eth.getAccounts()



    this.setState({ account: accounts[0] })
    //const networkId = await web3.eth.net.getId();

    //var CLPTAbi = JSON.parse('([{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]');
    //var NotariaAbi = JSON.parse('([{"inputs":[{"internalType":"contract IERC20","name":"_token","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"precio","type":"uint256"},{"indexed":false,"internalType":"string","name":"nombre","type":"string"},{"indexed":false,"internalType":"bool","name":"estado","type":"bool"},{"indexed":false,"internalType":"address","name":"owner","type":"address"}],"name":"DocumentoAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"address","name":"owner","type":"address"}],"name":"DocumentoComprado","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"precio","type":"uint256"},{"internalType":"string","name":"nombre","type":"string"},{"internalType":"bool","name":"estado","type":"bool"}],"indexed":false,"internalType":"struct Notaria.Documento","name":"documento","type":"tuple"},{"indexed":false,"internalType":"string","name":"nombre","type":"string"},{"indexed":false,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"precio","type":"uint256"}],"name":"DocumentoNotariaAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"recipient","type":"address"}],"name":"premioTokenDado","type":"event"},{"inputs":[{"internalType":"uint256","name":"_idDocumento","type":"uint256"}],"name":"AceptaDocumentoNotaria","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_precio","type":"uint256"},{"internalType":"string","name":"_nombre","type":"string"},{"internalType":"bool","name":"_estado","type":"bool"}],"name":"AddDocumento","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_idDocumento","type":"uint256"},{"internalType":"uint256","name":"_precio","type":"uint256"},{"internalType":"address","name":"_destinatario","type":"address"}],"name":"AddDocumentoNotaria","outputs":[{"internalType":"enum Notaria.EstadoDocumentoNotaria","name":"","type":"uint8"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_idDocumento","type":"uint256"}],"name":"FinalizaDocumentoNotaria","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_idDocumento","type":"uint256"}],"name":"GetDocumento","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"precio","type":"uint256"},{"internalType":"string","name":"nombre","type":"string"},{"internalType":"bool","name":"estado","type":"bool"}],"internalType":"struct Notaria.Documento","name":"doc","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_idDocumento","type":"uint256"},{"internalType":"address","name":"_direccion","type":"address"}],"name":"GetDocumentoNotariaDestinatario","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"precio","type":"uint256"},{"internalType":"string","name":"nombre","type":"string"},{"internalType":"bool","name":"estado","type":"bool"}],"internalType":"struct Notaria.Documento","name":"documento","type":"tuple"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"destinatario","type":"address"},{"internalType":"uint256","name":"precio","type":"uint256"},{"internalType":"enum Notaria.EstadoDocumentoNotaria","name":"estado","type":"uint8"}],"internalType":"struct Notaria.DocumentoNotaria","name":"doc","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_idDocumento","type":"uint256"},{"internalType":"address","name":"_direccion","type":"address"}],"name":"GetDocumentoNotariaEmisor","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"precio","type":"uint256"},{"internalType":"string","name":"nombre","type":"string"},{"internalType":"bool","name":"estado","type":"bool"}],"internalType":"struct Notaria.Documento","name":"documento","type":"tuple"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"destinatario","type":"address"},{"internalType":"uint256","name":"precio","type":"uint256"},{"internalType":"enum Notaria.EstadoDocumentoNotaria","name":"estado","type":"uint8"}],"internalType":"struct Notaria.DocumentoNotaria","name":"doc","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"GetOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_idDocumento","type":"uint256"}],"name":"RechazaDocumentoNotaria","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"ValidaDisponibilidadPremio","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"documentos","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"precio","type":"uint256"},{"internalType":"string","name":"nombre","type":"string"},{"internalType":"bool","name":"estado","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"documentosNotaria","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"precio","type":"uint256"},{"internalType":"string","name":"nombre","type":"string"},{"internalType":"bool","name":"estado","type":"bool"}],"internalType":"struct Notaria.Documento","name":"documento","type":"tuple"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"destinatario","type":"address"},{"internalType":"uint256","name":"precio","type":"uint256"},{"internalType":"enum Notaria.EstadoDocumentoNotaria","name":"estado","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"documentosNotariaCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"documentosNotariaDestinatario","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"precio","type":"uint256"},{"internalType":"string","name":"nombre","type":"string"},{"internalType":"bool","name":"estado","type":"bool"}],"internalType":"struct Notaria.Documento","name":"documento","type":"tuple"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"destinatario","type":"address"},{"internalType":"uint256","name":"precio","type":"uint256"},{"internalType":"enum Notaria.EstadoDocumentoNotaria","name":"estado","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"documentosNotariaEmisor","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"precio","type":"uint256"},{"internalType":"string","name":"nombre","type":"string"},{"internalType":"bool","name":"estado","type":"bool"}],"internalType":"struct Notaria.Documento","name":"documento","type":"tuple"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"destinatario","type":"address"},{"internalType":"uint256","name":"precio","type":"uint256"},{"internalType":"enum Notaria.EstadoDocumentoNotaria","name":"estado","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"documentsCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalDocumentosDestinatario","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalDocumentosEmisor","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}]');

    //var CLPTokenContract = web3.eth.contract(CLPTAbi);
    //var NotariaContract = web3.eth.contract(NotariaAbi);

    //var CLPTInstance  = CLPTokenContract.at('0xe02613bd4655B8E81D684759Af001CdF9E12269f')
    //var NotariaInstance = NotariaContract.at('0x2c55D39B02eAe91e59253012b756dAf8C48f91Bb')

    //console.log(CLPTInstance)
    //console.log(NotariaInstance)

    //const networkDataNotaria = NotariaContract.networks[networkId]
    //const networkDataCLPToken = CLPTokenContract.networks[networkId]

    //if (networkDataNotaria) {
    if (web3) {
      //Limpia los documentos cliente
      this.setDefaultVariables();

      //const notaria = new web3.eth.Contract(NotariaContract.abi, networkDataNotaria.address);
      const notaria = new web3.eth.Contract(NotariaContract.abi, '0x2c55D39B02eAe91e59253012b756dAf8C48f91Bb');
      //const CLPToken = new web3.eth.Contract(CLPTokenContract.abi, networkDataCLPToken.address);
      const CLPToken = new web3.eth.Contract(CLPTokenContract.abi, '0xe02613bd4655B8E81D684759Af001CdF9E12269f');

      const aggregatorV3InterfaceABI = [{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"description","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint80","name":"_roundId","type":"uint80"}],"name":"getRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];
      const ETHPrice = new web3.eth.Contract(aggregatorV3InterfaceABI, '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e');
      ETHPrice.methods.latestRoundData().call()
                                      .then((roundData) => {
                                          // Do something with roundData
                                          this.setState({ precioETH: roundData.answer})
                                          
                                      });


      this.setState({ notaria })
      //Las funciones call leen data      
      const documentosCount = await notaria.methods.documentsCount().call()
      const owner = await notaria.methods.GetOwner().call()

      this.setState({ documentosCount, owner: owner })

      const totalDocumentosEmisor = await notaria.methods.totalDocumentosEmisor(this.state.account).call()
      const totalDocumentosDestinatario = await notaria.methods.totalDocumentosDestinatario(this.state.account).call()



      

      //Documentos Emisor
      for (var a = 1; a <= totalDocumentosEmisor; a++) {
        const doc = await notaria.methods.documentosNotariaEmisor(this.state.account, a).call()
        this.setState({
          documentosEmisor: [...this.state.documentosEmisor, doc]
        })
      }

      //Documentos Destinatario
      for (var b = 1; b <= totalDocumentosDestinatario; b++) {
        const doc = await notaria.methods.documentosNotariaDestinatario(this.state.account, b).call()
        this.setState({
          documentosDestinatario: [...this.state.documentosDestinatario, doc]
        })
      }

      //Arreglo para listas documentos
      for (var j = 1; j <= documentosCount; j++) {
        const documento = await notaria.methods.documentos(j).call()
        this.setState({
          documentos: [...this.state.documentos, documento]
        })
      };

      const tokensUser = await CLPToken.methods.balanceOf(this.state.account).call()
      const tokensContrato = await CLPToken.methods.balanceOf(notaria._address).call()

      if (tokensUser != 'undefined') {
        let tokenString = (tokensUser).toString()
        { this.setState({ cantTokenUsuario: web3.utils.fromWei(tokenString, 'ether') }) }
      }
      if (tokensContrato != 'undefined') {
        let tokenString = (tokensContrato).toString()
        { this.setState({ cantTokenContrato: web3.utils.fromWei(tokenString, 'ether') }) }
      }

      this.setState({ loading: false })

    } else {
      this.setState({ loading: false })
      this.setDefaultVariables()
    }
  }



  nuevoDocumento(precio, nombre, estado) {
    this.setState({ loading: true })
    let web3 = window.web3
    let precioETH = web3.utils.toWei(precio, 'ether');

    this.state.notaria.methods.AddDocumento(precioETH, nombre, estado).send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
      });
  }

  async aceptaDocumento(id) {
    let web3 = window.web3

    await this.state.notaria.methods.AceptaDocumentoNotaria(id).send({ from: this.state.account })
      .on('error', (error) => {
        
        
      })
      .once('receipt', (receipt) => {
        this.loadBlockChainData()
      })
  };

  async finalizaDocumento(id) {
    let docDestinatario = await this.state.notaria.methods.documentosNotariaDestinatario(this.state.account, id).call()
    let precioDocumento = parseInt(docDestinatario.documento.precio, 10)
    let precioFinalizacion = parseInt(docDestinatario.precio, 10)
    let precioFinal = (precioDocumento + precioFinalizacion)

    await this.state.notaria.methods.FinalizaDocumentoNotaria(id).send({ from: this.state.account, value: precioFinal })
      .on('error', (error) => {

      })
      .once('receipt', (receipt) => {
        this.loadBlockChainData()
      })

  };

  async addDocumentoNotaria(id, precio, destinatario) {
    let web3 = window.web3
    let precioETH = web3.utils.toWei(precio, 'ether');
    await this.state.notaria.methods.AddDocumentoNotaria(id, precioETH, destinatario).send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.loadBlockChainData()
      })
      .on('confirmation', (confNumber, receipt, latestBlockHash) => {

      })
      .on('error', (error) => {

      })
  }

  render() {

    return (
      <div className="bg-light pt-5">
        <Navbar account={this.state.account} 
                precioETH={this.state.precioETH}
        />
        <div className="container-fluid mt-5">
          <div className="row mb-3">
            <div className="col-lg-12 d-flex justify-content-center">
              <div className="col-lg-4 bg-dark mx-2 p-5 border rounded ">
                <blockquote className="blockquote text-center text-white">
                  <p className="mb-2">Tenemos 10.000 Chilean Peso Token para los primeros 10.000 documentos finalizados de manera satisfactoria. Se regalarán
                    10 por trámite finalizado con éxito. Mantente atento a nuestras redes porque podrás disfrutar de múltiples beneficios.</p>
                  <footer className="blockquote-footer">Atte. <cite title="Source Title">Notaria Digital de Chile</cite></footer>
                  <p className="mb-2 mt-2 border border-white rounded bg-primary pt-2"><label>CLPT Disponibles: {this.state.cantTokenContrato}</label></p>
                  <p className="mb-0 border border-white bg-primary pt-"><label>CLPT: {this.state.cantTokenUsuario}</label></p>
                </blockquote>
              </div>
              <div className="col-lg-4 bg-dark mx-2 p-3 border rounded ">
                <blockquote className="blockquote text-white">
                  <p className="mb-2">Las instrucciones para poder utilizar la Notaria son: </p>
                  <p>Generación de Documento</p>
                  <ol>
                    <li> Escoge un Documento disponible. </li>
                    <li> Ingresa la dirección del destinatario para el trámite.</li>
                    <li> Ingresa el precio acordado en ETHER con el destinatario.</li>
                    <li> Click en Genrar Documento.</li>
                    <li> El destinatario visualizará el documento en el menu de Documentos Recibidos para continuar con el trámite.</li>
                  </ol>
                </blockquote>
                <blockquote className="blockquote text-white">
                  <p className="mb-2">Si alguien ha generado un Documento y eres el destinatario debes hacer lo siguiente: </p>

                  <ol>
                    <li> Visualiza el listado de Documentos Recibidos. </li>
                    <li> Según el Estado del trámite deberás primero Aceptarlo.</li>
                    <li> Una vez aceptado y deseas finalizar el Documento pagarás por el precio acordado mas el precio del documento.</li>
                  </ol>
                </blockquote>
              </div>

            </div>
          </div>
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              {this.state.loading
                ? <div className="spinner-grow" role="status">
                  <span className="sr-only">Loading...</span></div>
                : <Main
                  regiones={this.state.regiones}
                  owner={this.state.owner}
                  account={this.state.account}
                  documentos={this.state.documentos}
                  documentosPorCliente={this.state.documentosPorCliente}
                  documentosEmisor={this.state.documentosEmisor}
                  documentosDestinatario={this.state.documentosDestinatario}
                  nuevaRegion={this.nuevaRegion}
                  nuevoDocumento={this.nuevoDocumento}
                  compraDocumento={this.compraDocumento}
                  aceptaDocumento={this.aceptaDocumento}
                  finalizaDocumento={this.finalizaDocumento}
                  addDocumentoNotaria={this.addDocumentoNotaria}
                  
                />}

            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
