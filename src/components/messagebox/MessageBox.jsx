import React from "react";
import { createRoot } from "react-dom/client"; // 导入 createRoot
import AppModal from "./modal";

const defaultProps = {
  title: "MessageBox",
  content: <></>,
  container: "#app-message-box",
  buttons: []
};

export default {
  open: props => {
    return new Promise(resolve => {
      const { title, content, container, buttons } = {
        ...defaultProps,
        ...props
      };
      const containerElement = document.querySelector(container);
      if (!containerElement) throw Error(`can't find container ${container}`);

      const root = createRoot(containerElement); // 创建 root

      const handleClose = (value) => {
        let result = null;
        if (value && !value.target) {
          result = value;
        }
        root.unmount(); // 使用 root 的 unmount 方法
        return resolve(result);
      };

      const handleButton = handler => () => {
        handleClose(handler());
      };

      const renderBtns = () => {
        return <div className='flex flex-row justify-center space-x-5 mt-4'>
          {
            buttons.map(btn => {
              return (
                <div className={`rounded-full text-sm px-3 py-1 h-[30px] min-w-[100px] flex items-center ${btn.isDanger ? 'bg-[#FF4444]' : 'bg-color-main '} text-white font-semibold hover:opacity-70 justify-center  cursor-pointer`}
                  onClick={handleButton(btn.handler)} key={btn.name}>
                  {btn.name}
                </div>
              );
            })
          }
        </div>
      }

      root.render( // 使用 root 的 render 方法
        <AppModal title={title} onClose={handleClose}>
          <div className="mt-2 px-5 pb-5">
            {content}
          </div>
          {renderBtns()}
        </AppModal>
      );
    });
  }
};