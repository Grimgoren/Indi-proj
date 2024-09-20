export default function Recent() {
  return (
    <>
      <div className="banner">Recent projects page</div>
      <div className="navbar">
          <button className="navbutton">Home</button>
          <button className="navbutton">Contact</button>
          <button className="navbutton">About</button>
        </div>
      <div className="page-layout">
        <div className="side-content-container">
          <div className="content-side">
            <p>Side Content</p>
          </div>
        </div>
        <div className="content-container">
          <div className="content">
            <p>Content goes here</p>
          </div>
        </div>
      </div>
    </>
  );
}
