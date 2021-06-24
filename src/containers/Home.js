import React, { Component } from "react";
import "./Home.css";
import { API, Storage  } from "aws-amplify";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
//import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import axios from 'axios';
import LoaderButton from "../components/LoaderButton";
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Link } from "react-router-dom";

export default class Home extends Component {
  formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }

  renderNotesList(files) {
    return [{}].concat(files).map(
      (file, i) =>
        i !== 0
          ?  <div class="main">
                  <ListGroupItem>
                     <Grid fluid>
                      <Row>
                       <Col xs={12} sm={8} md={6} lg={6}>
                         { this.formatFilename(file.filename) }
                       </Col>
                       <Col xs={6} sm={4} md={4} lg={2} >
                       {new Date(file.createdAt).toLocaleString()}
                       </Col>
                       <Col xs={3} sm={2} md={2} lg={2}>
                     <form onSubmit={this.handleDownload.bind(this, file)}>
                      <LoaderButton
                         inline
                         bsStyle="primary"
                         bsSize="small"
                         disabled={false}
                         type="submit"
                         isLoading={this.state.isLoading}
                         text="Download"
                         loadingText="Downloading…"
                       />
                      </form> 
                      </Col>
                       <Col xs={3} sm={2} md={2} lg={2}>
                     <form onSubmit={this.handleDelete.bind(this, file)}>
                      <LoaderButton
                         inline
                         bsStyle="danger"
                         bsSize="small"
                         disabled={false}
                         type="submit"
                         isLoading={this.state.isLoading}
                         text="Delete"
                         loadingText="Deleting…"
                       />
                      </form> 
                       </Col>
                     </Row>
                    </Grid>
                  </ListGroupItem>
             </div>
          : <div>
              <LinkContainer
                key="new"
                to="/upload/new"
              >
                <ListGroupItem>
                  <h4>
                    <b>{"\uFF0B"}</b> Upload New File
                  </h4>
                </ListGroupItem>
              </LinkContainer>
                  <ListGroupItem>
                     <Grid fluid>
                      <Row>
                       <Col xs={12} sm={8} md={6} lg={6}>
                         <h4>Name</h4>
                       </Col>
                       <Col xs={6} sm={4} md={4} lg={2} >
                         <h4>Test</h4>
                       </Col>
                       <Col xs={3} sm={2} md={2} lg={2}>
                      </Col>
                       <Col xs={3} sm={2} md={2} lg={2}>
                       </Col>
                     </Row>
                    </Grid>
              </ListGroupItem>
           </div>
    );
  }

  deleteNote(file) {
    return API.del("files", `/file/${file.fileId}`);
  }

  async handleDelete(file, event){
      event.preventDefault();

      const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    this.setState({ isDeleting: true });
  
    try {
      await this.deleteNote(file);
      await Storage.vault.remove(file.filename);
      window.location.reload()
    } catch (e) {
      alert(e);
      this.setState({ isDeleting: false });
    }
  }

  handleDownload(file, e){
    e.preventDefault();
    console.log(file)
    axios({
    url: file["attachmentURL"],
    method: 'GET',
    responseType: 'blob', // important
  }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', file["filename"]);
    document.body.appendChild(link);
    link.click();
  });
  }

  constructor(props) {
      super(props);
  
      this.state = {
        isLoading: true,
        files: [],
        attachmentURL: null
      };
    }
 
  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }
    
    try {
      const files = await this.files();
      for( var i = 0; i < files.length; i++){
        files[i]["attachmentURL"] = await Storage.vault.get(files[i]["filename"]);
      }

      this.setState({ files });
      console.log(files) 
    } catch (e) {
      alert(e);
    }


    this.setState({ isLoading: false });
  }

  files() {
    return API.get("files", "/files");
  }

  renderLander() {
    return (
      <div className="lander">
        <h1>ShareBox</h1>
        <p>A simple storage application</p>
          <div>
            <Link to="/login" className="btn btn-info btn-lg">
              Login
            </Link>
            <Link to="/signup" className="btn btn-success btn-lg">
            Signup
            </Link>
          </div>
        </div>
    );
  }

  renderFiles() {
    return (
      <div className="files">
        <div className="lander">
          <h1>ShareBox</h1>
          <p>A simple storage application</p>
        </div>
        <PageHeader>Your Files</PageHeader>
        <ListGroup>
          {!this.state.isLoading && this.renderNotesList(this.state.files)}
        </ListGroup>
      </div>
    );
  }

  render() {
    return (
       <div className="Home">
          {this.props.isAuthenticated ? this.renderFiles() : this.renderLander()}
       </div>
    );
  }
}
