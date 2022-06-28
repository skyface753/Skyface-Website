import { BACKEND_FILES_URL } from "../consts";
import { useState, useEffect } from "react";
import FileSelectorByCallback from "./FileSelectorByCallback";
import TextareaAutosize from "react-textarea-autosize";

export const allTypes = [
  {
    label: "Text",
    value: "text",
  },
  {
    label: "Code",
    value: "code",
  },
  {
    label: "Image",
    value: "image",
  },
  {
    label: "Subline",
    value: "subline",
  },
  {
    label: "Link",
    value: "link",
  },
  {
    label: "Download",
    value: "download",
  },
  {
    label: "Pure HTML (dangerous)",
    value: "pureHTML",
  }
];

export class Content {
  constructor(position, for_blog, _id, type, createdAt, updatedAt) {
    if (new.target === Content) {
      throw new TypeError("Cannot construct Content instances directly");
    } else {
      this._id = _id;
      this.position = position;
      this.for_blog = for_blog;
      this.type = type;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  }
  // Abstract method
  showContent() {
    throw new TypeError("Abstract method");
  }

  getJSON() {
    throw new TypeError("Abstract method");
  }

  static fromJSON(json) {
    switch (json.type) {
      case "text":
        return  TextContent.fromJSON(json);
      case "code":
        return  CodeContent.fromJSON(json);
      case "image":
        return  ImageContent.fromJSON(json);
      case "subline":
        return  SublineContent.fromJSON(json);
      case "link":
        return  LinkContent.fromJSON(json);
      case "download":
        return  DownloadContent.fromJSON(json);
      case "pureHTML":
        return  pureHTMLContent.fromJSON(json);
      default:
        console.error("Unknown content type: " + json.type);
        throw new TypeError("Unknown content type");
    }
  }



  showEditor() {
    throw new TypeError("Abstract method");
  }

  getCopyableContentJSON() {
    throw new TypeError("Abstract method");
  }
}

export class TextContent extends Content {
  constructor(position, for_blog, _id, type, createdAt, updatedAt, text) {
    super(position, for_blog, _id, type, createdAt, updatedAt);
    this.text = text;
  }
  showContent() {
    return (
      <div key={this._id} className="content-div">
        <p id={this._id}>{this.text}</p>
      </div>
    );
  }
  showEditor(contents, setContents, index) {
    return (
      <div key={this._id} className="content-text-edit">
        <textarea
          id={this._id}
          value={this.text}
          onChange={(e) => {
            this.text = e.target.value;
            console.log("Index: ", index);
            contents[index] = this;
            setContents([...contents]);
          }}
        ></textarea>
      </div>
    );
  }
  getJSON() {
    return {
      position: this.position,
      for_blog: this.for_blog,
      _id: this._id,
      type: this.type,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      text: this.text,
    };
  }
  static fromJSON(json) {
    return new TextContent(
      json.position,
      json.for_blog,
      json._id,
      json.type,
      json.createdAt,
      json.updatedAt,
      json.text ? json.text : json.copyContent
    );
  }

  getCopyableContentJSON() {
    return {
      position: this.position,
      for_blog: this.for_blog,
      _id: this._id,
      type: this.type,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      copyContent: this.text,
    };
  }
}

class CodeContent extends Content {
  constructor(position, for_blog, _id, type, createdAt, updatedAt, code) {
    super(position, for_blog, _id, type, createdAt, updatedAt);
    this.code = code;
  }

  showContent() {
    return (
      <pre className="pre-code" key={this._id}>
        <code>{this.code}</code>
        <button
          className="copy-code-button"
          onClick={() => copyCode(this.code)}
        >
          Copy Code
        </button>
      </pre>
    );
  }

  showEditor(contents, setContents, index) {
    return (
      <div key={this._id} className="content-code-edit">
        <TextareaAutosize
          style={{"width": "100%"}}
          id={this._id}
          value={this.code}
          wrap="off"
          className="code-textarea"
          onChange={(e) => {
            this.code = e.target.value;
            contents[index] = this;
            setContents([...contents]);
          }}
          onKeyDown={(e) => {
            let caret = e.target.selectionStart;

                    if (e.key === "Tab") {
                      e.preventDefault();

                      let newText =
                        e.target.value.substring(0, caret) +
                        " ".repeat(4) +
                        e.target.value.substring(caret);
                      e.target.value = newText;
                      this.code = newText;

                        contents[index] = this;

                      setContents([...contents]);
                      
                      // setPost({ ...posts, blogContent: content });
                      // Go to position after the tab
                      e.target.selectionStart = e.target.selectionEnd =
                        caret + 4;

                      // setText({value: newText, caret: caret, target: e.target});
                    }
                  }
                }
              />
        {/* <textarea
          id={this._id}
          value={this.code}
          onChange={(e) => {
            this.code = e.target.value;
            contents[index] = this;
            setContents([...contents]);
          }}
        ></textarea> */}
      </div>
    );
  }

  getJSON() {
    return {
      position: this.position,
      for_blog: this.for_blog,
      _id: this._id,
      type: this.type,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      code: this.code,
    };
  }

  static fromJSON(json) {
    console.log(json);
    return new CodeContent(
      json.position,
      json.for_blog,
      json._id,
      json.type,
      json.createdAt,
      json.updatedAt,
      json.code ? json.code : json.copyContent
    );
  }

  getCopyableContentJSON() {
    return {
      position: this.position,
      for_blog: this.for_blog,
      _id: this._id,
      type: this.type,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      copyContent: this.code,
    };
  }
}

class ImageContent extends Content {
  constructor(position, for_blog, _id, type, createdAt, updatedAt, image) {
    super(position, for_blog, _id, type, createdAt, updatedAt);
    this.image = image;
  }

  showContent() {
    return (
      <div key={this._id}>
        <img
          src={BACKEND_FILES_URL + this.image}
          alt={this.image}
          className="blog-image"
        />
      </div>
    );
  }

  showEditor(contents, setContents, index) {
    if (this.editMode) {
      return (
        <FileSelectorByCallback
          onCloseCB={() => {
            this.editMode = false;
            setContents([...contents]);
          }}
          onSelectCB={(file) => {
            this.image = file.generated_name;
            this.editMode = false;
            contents[index] = this;
            setContents([...contents]);
          }}
        />
      );
    }
    return (
      <div key={this._id} className="content-image-edit">
        <img
          src={BACKEND_FILES_URL + this.image}
          alt={this.image}
          className="blog-image"
          style={{
            maxWidth: "50%",
          }}
        />
        <button
          className="select-image-button"
          onClick={() => {
            this.editMode = true;
            setContents([...contents]);
          }}
        >
          Select Image
        </button>
      </div>
    );
  }

  getJSON() {
    return {
      position: this.position,
      for_blog: this.for_blog,
      _id: this._id,
      type: this.type,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      image: this.image,

    };
  }

  static fromJSON(json) {
    return new ImageContent(
      json.position,
      json.for_blog,
      json._id,
      json.type,
      json.createdAt,
      json.updatedAt,
      json.image ? json.image : json.copyContent
    );
  }

  getCopyableContentJSON() {
    return {
      position: this.position,
      for_blog: this.for_blog,
      _id: this._id,
      type: this.type,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      copyContent: this.image,
    };
  }

}

class LinkContent extends Content {
  constructor(position, for_blog, _id, type, createdAt, updatedAt, link) {
    super(position, for_blog, _id, type, createdAt, updatedAt);
    this.link = link;
  }

  showContent() {
    return (
      <div key={this._id} className="content-link-div">
        <a href={this.link} target="_blank" rel="noopener noreferrer">
          {this.link}
        </a>
      </div>
    );
  }

  showEditor(contents, setContents, index) {
    return (
      <div key={this._id} className="content-link-edit">
        <input
          id={this._id}
          type="text"
          value={this.link}
          onChange={(e) => {
            this.link = e.target.value;
            contents[index] = this;
            setContents([...contents]);
          }}
        />
      </div>
    );
  }

  getJSON() {
    return {
      position: this.position,
      for_blog: this.for_blog,
      _id: this._id,
      type: this.type,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      link: this.link,

    };
  }

  static fromJSON(json) {
    return new LinkContent(
      json.position,
      json.for_blog,
      json._id,
      json.type,
      json.createdAt,
      json.updatedAt,
      json.link ? json.link : json.copyContent
    );
  }

  getCopyableContentJSON() {
    return {
      position: this.position,
      for_blog: this.for_blog,
      _id: this._id,
      type: this.type,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      copyContent: this.link,
    };
  }
}

class DownloadContent extends Content {
  constructor(position, for_blog, _id, type, createdAt, updatedAt, download) {
    super(position, for_blog, _id, type, createdAt, updatedAt);
    this.download = download;
  }

  showContent() {
    return (
      <div key={this._id} className="content-download-div">
        {this.download}
        <form
          method="GET"
          target="_blank"
          rel="noopener noreferrer"
          action={BACKEND_FILES_URL + this.download}
        >
          <button className="btn">
            <i className="fa fa-download"></i> Download
          </button>
        </form>
      </div>
    );
  }

  showEditor(contents, setContents, index) {
    if(this.editMode) {
      return(
        <FileSelectorByCallback
          onCloseCB={() => {
            this.editMode = false;
            setContents([...contents]);
          }}
          onSelectCB={(file) => {
            this.download = file.generated_name;
            this.editMode = false;
            contents[index] = this;
            setContents([...contents]);
          }}
        />
      )}
    return (
      <div key={this._id} className="content-download-edit">
<button className="btn">
            <i className="fa fa-download"></i> {this.download}
          </button>
        <button
          className="select-download-button"
          onClick={() => {
            this.editMode = true;
            setContents([...contents]);
          }
          }>Select File</button>
      </div>
    );
  }

  getJSON() {
    return {
      position: this.position,
      for_blog: this.for_blog,
      _id: this._id,
      type: this.type,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      download: this.download,
    };
  }

  static fromJSON(json) {
    return new DownloadContent(
      json.position,
      json.for_blog,
      json._id,
      json.type,
      json.createdAt,
      json.updatedAt,
      json.download ? json.download : json.copyContent
    );
  }

  getCopyableContentJSON() {
    return {
      position: this.position,
      for_blog: this.for_blog,
      _id: this._id,
      type: this.type,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      copyContent: this.download,

    };
  }
}

class SublineContent extends Content {
  constructor(position, for_blog, _id, type, createdAt, updatedAt, subline) {
    super(position, for_blog, _id, type, createdAt, updatedAt);
    this.subline = subline;
  }

  showContent() {
    return (
      <h3 key={this._id} className="sublines">
        {this.subline}
      </h3>
    );
  }

  showEditor(contents, setContents, index) {
    return (
      <div key={this._id} className="content-subline-edit">
        <input
          id={this._id}
          type="text"
          value={this.subline}
          onChange={(e) => {
            this.subline = e.target.value;
            contents[index] = this;
            setContents([...contents]);
          }}
        />
      </div>
    );
  }

  getJSON() {
    return {
      position: this.position,
      for_blog: this.for_blog,
      _id: this._id,
      type: this.type,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      subline: this.subline,

    };
  }

  static fromJSON(json) {
    return new SublineContent(
      json.position,
      json.for_blog,
      json._id,
      json.type,
      json.createdAt,
      json.updatedAt,
      json.subline ? json.subline : json.copyContent
    );
  }

  getCopyableContentJSON() {
    return {
      position: this.position,
      for_blog: this.for_blog,
      _id: this._id,
      type: this.type,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      copyContent: this.subline,
    };
  }
}

class pureHTMLContent extends Content {
  constructor(position, for_blog, _id, type, createdAt, updatedAt, pureHTML) {
    super(position, for_blog, _id, type, createdAt, updatedAt);
    this.pureHTML = pureHTML;
  }

  showContent() {
    return (
      <div dangerouslySetInnerHTML={{ __html: this.pureHTML }} key={this._id} />
    );
  }

  showEditor(contents, setContents, index) {
    return (
      <div key={this._id} className="content-html-edit">
        <textarea
          id={this._id}
          value={this.pureHTML}
          
          onChange={(e) => {
            this.pureHTML = e.target.value;
            contents[index] = this;
            setContents([...contents]);
          }}
        />
      </div>
    );
  }

  getJSON() {
    return {
      position: this.position,
      for_blog: this.for_blog,
      _id: this._id,
      type: this.type,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      pureHTML: this.pureHTML,
    };
  }

  static fromJSON(json) {
    return new pureHTMLContent(
      json.position,
      json.for_blog,
      json._id,
      json.type,
      json.createdAt,
      json.updatedAt,
      json.pureHTML ? json.pureHTML : json.copyContent
    );
  }

  getCopyableContentJSON() {
    return {
      position: this.position,
      for_blog: this.for_blog,
      _id: this._id,
      type: this.type,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      copyContent: this.pureHTML,
    };
  }
}

export default function TextContentPageTEST() {
  var contentsTemp = contentsFromApi.map((content) => {
    return Content.fromJSON(content);
  });
  var for_blog = "abc";

  const [contents, setContents] = useState(contentsTemp);
  checkAndCorrectPosition(contents);



  console.log(contents);

  return (
    <div>
      <h1>Text Content Page</h1>
      {contents.map((content) => {
        if (content != null) {
          return content.showContent();
        }
      })}
      <div className="divider"></div>
      <h1>Editor</h1>
      {/* Divider */}
      {contents.map((content, index) => {
        if (content != null) {
          // if (content.type === "text") {
          return(
            <div key={"blub" + content._id}>
              <select
              defaultValue={content.type}
              onChange={(e) => {
                var copyableContentJSON = content.getCopyableContentJSON();
                copyableContentJSON.type = e.target.value;
                contents[index] = Content.fromJSON(copyableContentJSON);
                setContents([...contents]);
              }}>
                {allTypes.map((type) => {
                  return (
                    <option value={type.value} key={type.value}>
                      {type.label}
                    </option>
                  );
                }
                )}
              </select>
              <button 
                className="content-up-button"
                onClick={() => {
                  if(content.position > 0) {
                    var tempContent = contents[index];
                    contents[index] = contents[index - 1];
                    contents[index - 1] = tempContent;
                    setContents([...contents]);
                  }
                }
                }>
                Up
              </button>
              <button
                className="content-down-button"
                onClick={() => {
                  if(content.position < contents.length - 1) {
                    var tempContent = contents[index];
                    contents[index] = contents[index + 1];
                    contents[index + 1] = tempContent;
                    setContents([...contents]);
                  }
                }
                }>
                Down
              </button>
              <button
                className="content-delete-button"
                onClick={() => {
                  contents.splice(index, 1);
                  setContents([...contents]);
                }
                }>
                Delete
              </button>
              {content.showEditor(contents, setContents, index)}
            </div>
          );
        }
      }
      )}
      <button onClick={() => {
        var newContent = new TextContent(
          contents.length,
          null,
          "NEW" + contents.length,
          "text",
          null, 
          null,
          "New Text"
        );
        contents.push(newContent);
        setContents([...contents]);
      }
      }>
        Add Content
      </button>
      <button onClick={() => {
        // Save
        var json = contents.map((content) => {
          return content.getJSON();
        })
        console.log(json);
      }}>
        Save
      </button>



      <style jsx="true">{`
        .divider {
          border-top: 1px solid #eaeaea;
          margin: 20px 0;
        }
      `}</style>
    </div>
  );

  function checkAndCorrectPosition(contents) {
    for (let i = 0; i < contents.length; i++) {
      if (contents[i].position !== i) {
        contents[i].position = i;
      }
    }
  }
}

function copyCode(code) {
  navigator.clipboard.writeText(code);
}



const contentsFromApi = [
  {
    _id: "62b5e1cde384ff001371cc20",
    text: "First clone the git repo",
    for_blog: "62b5e164e384ff001371cb47",
    position: 0,
    type: "text",
    createdAt: "2022-06-24T16:09:49.707Z",
    updatedAt: "2022-06-24T16:09:49.707Z",
    __v: 0,
  },
  {
    _id: "62b5e1cde384ff00137wfcwhcdu",
    text: "Second do blabla",
    for_blog: "fewfnjekw",
    position: 1,
    type: "text",
    createdAt: "2022-06-24T16:09:49.707Z",
    updatedAt: "2022-06-24T16:09:49.707Z",
    __v: 0,
  },
  {
    _id: "62b5e1cde384ff001371cc22",
    code: "git clone --branch release_18fewfhjwebfhjewbfjhbewjhefbfjhwbcjhwbhjcwbhj https://github.com/Unity-Technologies/ml-agents.git\nfewhfj",
    for_blog: "62b5e164e384ff001371cb47",
    position: 2,
    type: "code",
    createdAt: "2022-06-24T16:09:49.709Z",
    updatedAt: "2022-06-24T16:09:49.709Z",
    __v: 0,
  },
  {
    _id: "62b5e1cde384ff001371cc28",
    link: "https://drive.google.com/file/d/1e-7R3tfyJqv0P4ijZOLDYOleAJ0JrGyJ/view",
    for_blog: "62b5e164e384ff001371cb47",
    position: 3,
    type: "link",
    createdAt: "2022-06-24T16:09:49.713Z",
    updatedAt: "2022-06-24T16:09:49.713Z",
    __v: 0,
  },
  {
    _id: "62b5e1cde384ff001371cc2e",
    subline: "Navigate to the Git-Repo from the beginning",
    for_blog: "62b5e164e384ff001371cb47",
    position: 4,
    type: "subline",
    createdAt: "2022-06-24T16:09:49.726Z",
    updatedAt: "2022-06-24T16:09:49.726Z",
    __v: 0,
  },
  {
    _id: "62b5e1cde384ff001371cc3c",
    image: "Bildschirmfoto-2022-05-01-um-23.45.35.png",
    for_blog: "62b5e164e384ff001371cb47",
    position: 100,
    type: "image",
    createdAt: "2022-06-24T16:09:49.742Z",
    updatedAt: "2022-06-24T16:09:49.742Z",
    __v: 0,
  },
  {
    _id: "62b5f7ff4e825f00129b9ac4",
    download: "haarcascade_frontalface_default.xml",
    for_blog: "62b5e52ae384ff001372b04c",
    position: 6,
    type: "download",
    createdAt: "2022-06-24T17:44:31.133Z",
    updatedAt: "2022-06-24T17:44:31.133Z",
    __v: 0,
  },
  {
    _id: "62b6ff08cf20410014c30bc7",
    html: '<div class="cloud-container">\n      <svg\n        xmlns="http://www.w3.org/2000/svg"\n        viewBox="7.87722 9.61948 33.01 16.88"\n      >\n        <path\n          d="M 12 26 H 37 C 42 26 41 20 37 20 C 38 18 37 15 33 16 C 32 8 15 8 14 17 C 8 16 6 25 12 26"\n          class="cloud-back"\n        />\n        <path\n          d="M 12 26 H 37 C 42 26 41 20 37 20 C 38 18 37 15 33 16 C 32 8 15 8 14 17 C 8 16 6 25 12 26"\n          class="cloud-front"\n        />\n      </svg>\n    </div>',
    for_blog: "62b6ff08cf20410014c30bbb",
    position: 7,
    type: "pureHTML",
    createdAt: "2022-06-25T12:26:48.549Z",
    updatedAt: "2022-06-25T12:26:48.549Z",
    __v: 0,
  },
];

