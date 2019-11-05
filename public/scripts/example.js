var data =[
    {author:"yoshi", text:"il mio commento"},
    {author:"rey", text:"gatto di shroendiger"}
];

 class CommentBox extends React.Component{
    constructor(props) {
        super(props)
        this.state ={
            data: []
        };
    }
          
    handleCommentSubmit(comment){
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data:comment,
            success: function(data) {
              this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
              console.error(this.props.url, status, err.toString());
            }.bind(this)
    }); 
}
    loadCommentsFromServer(){
            $.ajax({
              url: this.props.url,
              dataType: 'json',
              type: 'GET',
              success: function(data) {
                this.setState({data: data});
              }.bind(this),
              error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
              }.bind(this)
      }); 
    }
    componentDidMount() {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer.bind(this), 
        this.props.pollInterval);
      }

    render() {
      return (
        <div className="commentBox">
          <h1>lista dei commenti</h1>
          <CommentList data={this.state.data}/>
          <CommentForm onCommentSubmit={this.handleCommentSubmit.bind(this)}/>
        </div>
); 
}
  };

class CommentList extends React.Component{
    render(){
        var risultatoMappaCommenti = this.props.data.map(
            (msg,indice)=> { return (
                <Comment key={indice} className="comment" author={msg.author}>
                    {msg.text}
                </Comment>
            )
            }
            );
        return(
            <div className="commentBox">
            {risultatoMappaCommenti}
          </div>
        )
    }
};
class CommentForm extends React.Component{
        handleSubmit(event){
            event.preventDefault();
            var author=ReactDOM.findDOMNode(this.refs.author).value;
            var text=ReactDOM.findDOMNode(this.refs.text).value;
            if (!text || !author) {
                return;
            }
            //todo chiama il server e fai la post
            console.log("serverrrrrrr" + author + text)
            this.props.onCommentSubmit({author,text});
            //pulisco i valoti fopo l'invio
            ReactDOM.findDOMNode(this.refs.author).value ='';
            ReactDOM.findDOMNode(this.refs.text).value ='';
            return;
          }
  
    render(){
        return(
            <form className="commentForm" onSubmit={this.handleSubmit.bind(this)}>
            <input type="text" placeholder="Il tuo nome" ref="author" />
            <input type="text" placeholder="Di' qualcosa..." ref="text"/>
            <input type="submit" value="Invia" />
            </form>
        )
    }
};
class Comment extends React.Component{
    rawMarkup(myMarkupString) {
        var md = new Remarkable();
        var rawMarkup = md.render(myMarkupString);
        return { __html: rawMarkup };
  }

    render(){
        let md = new Remarkable();
        return(
            <div className ="content">
                <h2 className="contentAuthor">
                    {this.props.author}

                </h2>
                <span dangerouslySetInnerHTML={this.rawMarkup(this.props.children.toString())} />
            </div>
        )
    }
};


  ReactDOM.render(
    <CommentBox url="/api/comments" pollInterval="2000"/>,
    document.getElementById('content')
  );