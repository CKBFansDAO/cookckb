import React from "react";
import "./modal.css";
import { ReactComponent as WarningIcon } from '../../assets/images/icon-warn-02.svg';


const defaultProps = {
  title: "ModalTitle",
  onClose: () => {}
};

const AppModal = (props) => {
  const { title, onClose } = { ...defaultProps, ...props };
  return (<>
    <div className="justify-center items-center flex overflow-x-hidden  select-none overflow-y-auto fixed inset-0 z-[9999] outline-none focus:outline-none">
      <div>
        <div className="flex flex-col bg-[#313846] shadow-[0_0_5px_0px_rgba(0,0,0,0.5)] rounded-2xl w-[400px] ">
            <div className='flex flex-row items-center px-5 pt-5 rounded-t'>
                <span className='ml-2 flex items-center'>{title}</span>
                <div className='grow'></div>
                <i className="fa-solid text-white fa-lg mt-3 z-30 fa-xmark cursor-pointer hover:text-[#FF4444]" onClick={onClose}></i>
            </div>
            <div className="flex items-center justify-center">
              <WarningIcon className="h-14 w-14"></WarningIcon>
            </div>
            <div className="p-5">{props.children}</div>
        </div>
      </div> 
    </div>
    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

export default AppModal;