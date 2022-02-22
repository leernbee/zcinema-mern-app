import React from 'react';

// reactstrap components
import { Container } from 'reactstrap';

function CompletedHeader() {
  let pageHeader = React.createRef();

  React.useEffect(() => {
    if (window.innerWidth > 991) {
      const updateScroll = () => {
        let windowScrollTop = window.pageYOffset / 3;
        pageHeader.current.style.transform =
          'translate3d(0,' + windowScrollTop + 'px,0)';
      };
      window.addEventListener('scroll', updateScroll);
      return function cleanup() {
        window.removeEventListener('scroll', updateScroll);
      };
    }
  });

  return (
    <>
      <div
        className='page-header clear-filter account-header-small'
        filter-color='blue'
      >
        <div
          className='page-header-image'
          style={{
            backgroundImage:
              'url(' + require('assets/img/movie-posters.jpg') + ')'
          }}
          ref={pageHeader}
        ></div>
        <Container>
          <h3 className='title'>Thank You!</h3>
        </Container>
      </div>
    </>
  );
}

export default CompletedHeader;
