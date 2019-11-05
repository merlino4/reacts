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

    componentDidMount(){
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
    render() {
      return (
        <div className="commentBox">
          <h1>lista dei commenti</h1>
          <CommentList data={this.state.data}/>
          <CommentForm />
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
    render(){
        return(
            <div className="commentBox">
            Ciao, mondo! Sono un CommentForm.
          </div>
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
    <CommentBox url="/api/comments"/>,
    document.getElementById('content')
  );