import { Image, ScrollView, Text, View } from "react-native";
import { BACKEND_FILES_URL } from "../constants";

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

  static fromJSON(json) {
    switch (json.type) {
      case "text":
        return TextContent.fromJSON(json);
      case "code":
        return CodeContent.fromJSON(json);
      case "image":
        return ImageContent.fromJSON(json);
      case "subline":
        return SublineContent.fromJSON(json);
      case "link":
        return LinkContent.fromJSON(json);
      case "download":
        return DownloadContent.fromJSON(json);
      case "pureHTML":
        return pureHTMLContent.fromJSON(json);
      default:
        console.error("Unknown content type: " + json.type);
        throw new TypeError("Unknown content type");
    }
  }
}

export class TextContent extends Content {
  constructor(position, for_blog, _id, type, createdAt, updatedAt, text) {
    super(position, for_blog, _id, type, createdAt, updatedAt);
    this.text = text;
  }
  showContent() {
    return (
      <View>
        <Text>{this.text}</Text>
      </View>
    );
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
}

class CodeContent extends Content {
  constructor(position, for_blog, _id, type, createdAt, updatedAt, code) {
    super(position, for_blog, _id, type, createdAt, updatedAt);
    this.code = code;
  }

  showContent() {
    return (
      <ScrollView
        horizontal={true}
        style={{ padding: 10, backgroundColor: "gray" }}
      >
        <Text
          selectable={true}
          style={{
            color: "white",
          }}
        >
          {this.code}
        </Text>
      </ScrollView>
    );
  }

  static fromJSON(json) {
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
}

class ImageContent extends Content {
  constructor(position, for_blog, _id, type, createdAt, updatedAt, image) {
    super(position, for_blog, _id, type, createdAt, updatedAt);
    this.image = image;
  }

  showContent() {
    return (
      <View>
        <Text>IMAGE</Text>
        <Image
          source={{ uri: BACKEND_FILES_URL + this.image }}
          style={{ width: 300, height: 300 }}
        />
      </View>
      //   <div key={this._id}>
      //     <img
      //       src={BACKEND_FILES_URL + this.image}
      //       alt={this.image}
      //       className="blog-image"
      //     />
      //   </div>
    );
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
}
