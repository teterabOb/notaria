// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CLPToken.sol";

contract Notaria  {
    address public owner;
    uint public documentsCount = 0;
    uint public documentosNotariaCount = 0;
    IERC20 private token;
    enum EstadoDocumentoNotaria{ ABIERTO, ACEPTADO, FINALIZADO }

    struct Documento{ 
        uint id;
        uint precio;
        string nombre;
        bool estado;
    }

    struct DocumentoNotaria{
        uint id;
        Documento documento;
        address owner;
        address destinatario;
        uint precio;
        EstadoDocumentoNotaria estado;
    }

    mapping(uint => Documento) public documentos;

    mapping(address => uint) public totalDocumentosEmisor;
    mapping(address => uint) public totalDocumentosDestinatario;
    
    mapping(uint => DocumentoNotaria) public documentosNotaria;
    mapping(address => mapping(uint => DocumentoNotaria)) public documentosNotariaEmisor;
    mapping(address => mapping(uint => DocumentoNotaria)) public documentosNotariaDestinatario;
    
    event DocumentoAdded(uint id, uint precio, string nombre, bool estado, address owner);
    event DocumentoNotariaAdded(uint id, Documento documento, string nombre,  address owner, uint precio);
    event DocumentoComprado(uint id, address owner);
    event premioTokenDado(address recipient);    

    constructor(IERC20 _token) {
        token = _token;
        owner = msg.sender;  
    }

    function EnviarPremioToken() private {
        uint256 amountToWithDrawal = token.balanceOf(address(this));
        require(amountToWithDrawal >= 10000000000000000000, "No hay suficientes tokens");
        token.transfer(msg.sender, 10000000000000000000);   
        emit premioTokenDado(msg.sender);
    } 

    function ValidaDisponibilidadPremio() public view returns (bool){
        uint256 amountToWithDrawal = token.balanceOf(address(this));
        if(amountToWithDrawal >= 10000000000000000000){
            return true;
        }else{
            return false;
        }
    }

    function AddDocumento(uint _precio, string memory _nombre, bool _estado) public payable{
        require(msg.sender == owner, "Funcionalidad solo permitida para el owner");
        require(bytes(_nombre).length > 0, "El nombre debe tener un largo minimo");
        documentsCount++;
        documentos[documentsCount] = Documento(documentsCount, _precio,_nombre,_estado);       
        
        emit DocumentoAdded(documentsCount,_precio, _nombre, _estado, msg.sender);
    }

    function ValidaDirecciones(address _destinatario) internal view returns (bool)
    {
        require(msg.sender != address(0), "El destinatario debe ser una direccion valida");
        require(_destinatario != address(0), "El destinatario debe ser una direccion valida");
        require(msg.sender != _destinatario, "El emisor del documento debe ser distinto al destinatario");
        return true;
    }
    
    function AddDocumentoNotaria(uint _idDocumento, uint _precio, address _destinatario) public payable returns(EstadoDocumentoNotaria){

        Documento memory doc = documentos[_idDocumento];
        require(doc.id > 0, "El documento no existe en nuestros registros");
        documentosNotariaCount++;
        DocumentoNotaria memory docNotaria = DocumentoNotaria(documentosNotariaCount, doc, msg.sender, _destinatario, _precio, EstadoDocumentoNotaria.ABIERTO);
        documentosNotaria[documentosNotariaCount] = docNotaria;

        totalDocumentosEmisor[msg.sender]++;
        totalDocumentosDestinatario[_destinatario]++;
        documentosNotariaEmisor[msg.sender][documentosNotariaCount] = docNotaria;
        documentosNotariaDestinatario[_destinatario][documentosNotariaCount] = docNotaria;   
 
        return docNotaria.estado;
    }
    
    function AceptaDocumentoNotaria(uint _idDocumento) public returns (bool){        
        DocumentoNotaria memory _docNotaria = GetDocumentoNotaria(_idDocumento);        
        require(_docNotaria.estado == EstadoDocumentoNotaria.ABIERTO);
        require(_docNotaria.destinatario == msg.sender, "Solo el destinatario puede aceptar el Documento");        
        documentosNotaria[_idDocumento].estado = EstadoDocumentoNotaria.ACEPTADO;        
        documentosNotariaDestinatario[msg.sender][_idDocumento].estado = EstadoDocumentoNotaria.ACEPTADO;        
        require(documentosNotariaEmisor[_docNotaria.owner][_idDocumento].destinatario == _docNotaria.destinatario, "El destinatario no coincide con el de origen");
        documentosNotariaEmisor[_docNotaria.owner][_idDocumento].estado = EstadoDocumentoNotaria.ACEPTADO;       
        return true;
    }
    
    function FinalizaDocumentoNotaria(uint _idDocumento) public payable returns (bool){        
        DocumentoNotaria memory _docNotaria = GetDocumentoNotaria(_idDocumento);
        uint precioDoc = _docNotaria.documento.precio;
        require(_docNotaria.destinatario == msg.sender, "Solo el destinatario puede Acceder a la finalizacion de este Documento");
        require(documentosNotariaEmisor[_docNotaria.owner][_idDocumento].destinatario == _docNotaria.destinatario, "Solo el destinatario puede Acceder a la finalizacion de este Documento 2");
        require(msg.value == _docNotaria.precio + precioDoc, "El Monto enviado no corresponde al valor del precio del Documento");
        require(_docNotaria.estado == EstadoDocumentoNotaria.ACEPTADO, "El documento debe haber sido Aceptado previamente");              
        
        documentosNotaria[_idDocumento].estado = EstadoDocumentoNotaria.FINALIZADO;
        documentosNotariaDestinatario[msg.sender][_idDocumento].estado = EstadoDocumentoNotaria.FINALIZADO;
        documentosNotariaEmisor[_docNotaria.owner][_idDocumento].estado = EstadoDocumentoNotaria.FINALIZADO;

        payable(_docNotaria.owner).transfer(_docNotaria.precio);  

        if(ValidaDisponibilidadPremio() == true){
            EnviarPremioToken();
        }     
        return true;
    }
    
    function RechazaDocumentoNotaria(uint _idDocumento) public payable returns (bool){
        DocumentoNotaria memory _docNotaria = GetDocumentoNotaria(_idDocumento);
        require(_docNotaria.estado == EstadoDocumentoNotaria.ACEPTADO || _docNotaria.estado == EstadoDocumentoNotaria.ABIERTO);
        return true;
    }
    
    function GetDocumento(uint _idDocumento) public view returns(Documento memory doc){
        doc = documentos[_idDocumento];
        return doc;
    }
    
    function GetDocumentoNotaria(uint _idDocumento) internal virtual view returns(DocumentoNotaria memory doc){
        doc = documentosNotaria[_idDocumento];
        return doc;
    }
    
    function GetDocumentoNotariaEmisor(uint _idDocumento, address _direccion) public view returns(DocumentoNotaria memory doc){
        doc = documentosNotariaEmisor[_direccion][_idDocumento];
        return doc;
    }
    
    function GetDocumentoNotariaDestinatario(uint _idDocumento, address _direccion) public view returns(DocumentoNotaria memory doc){
        doc = documentosNotariaDestinatario[_direccion][_idDocumento];
        return doc;
    } 
    
    function GetOwner() public view returns (address){        
        return owner;
    }

    modifier isOwner(){
        require(msg.sender == owner);
        _;
    } 

    receive() external payable {} 
}