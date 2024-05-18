import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Spinner from "../shared/Spinner";
import { Button, buttonVariants } from "../ui/button";
import dynamic from "next/dynamic";


const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    height: 685,
    padding: 0,
    borderRadius: 12,
    overflow: 'visible'
  }
};

// const LiquidityModal = dynamic(() => import("../liquidity-modal"), {
//   ssr: false,
//   loading: props => {
//     if (props.isLoading) {
//       return (
//         <Button variant="default" disabled size="sm">
//           <span>Get More</span>
//           <Spinner size="small" className="ml-2" />
//         </Button>
//       );
//     } else return null;
//   }
// });

const KadoIFrameModal = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bech32Address, setBech32Address] = useState<string | null>(null);

  console.log('bech32Address', bech32Address);


  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      Modal.setAppElement('#__next');
    };
    const address = localStorage.getItem('walletAddress');
    setBech32Address(address);
  }, []);

  const openModal = () => {
    setModalIsOpen(true);
    setLoading(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setLoading(true);
  };

  return (
    <div className='containers'>
      <button className='toggle-button' onClick={openModal}>
        <span>Buy Using Flat Payment Option</span>
        <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path d='M11.5358 4.46447L4.46469 11.5355M11.5358 4.46447L6.00037 4.46448M11.5358 4.46447L11.5358 10.0001' stroke='currentColor' strokeWidth='1.25' strokeLinecap='square' strokeLinejoin='bevel'></path>
        </svg>
      </button>
      {/* <LiquidityModal address={''} aktBalance={0} refreshBalances={function (): void {
        throw new Error('Function not implemented.');
      } }/> */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEsc={false}
        style={customStyles}
      >
        <div className='close-container'>
          <button type='button' onClick={closeModal}>
            +
          </button>
        </div>
        {loading 
          ? <div className='loader-container'>
              <div className='loader' />
            </div>
          : null
        }
        <div>
          <iframe
            src={`https://app.kado.money/?onPayCurrency=USD&onRevCurrency=OSMO&offPayCurrency=OSMO&offRevCurrency=USD&fiatList=USD,INR,CAD&network=osmosis&product=BUY&onToAddress=${bech32Address}`}
            width='500'
            height='686'
            frameBorder={0}
            onLoad={() => setLoading(false)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default KadoIFrameModal;
