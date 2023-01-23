import React, { useCallback, useEffect } from "react";
import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";

import attach from "../assets/images/attach-icon.svg";
import microphone from "../assets/images/microphone-icon.svg";
import smile from "../assets/images/smile-icon.svg";

export default function Footer(prop) {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.message);

  const setTime = useCallback(() => {
    let currentDate = new Date();
    let hours = `${currentDate.getHours()}`;
    let minutes = `${currentDate.getMinutes()}`;
    return checkDateLength(hours, minutes).join(":");
  }, []);

  const setDate = useCallback(() => {
    let currentDate = new Date();
    let day = `${currentDate.getDate()}`;
    let month = `${currentDate.getMonth() + 1}`;
    let year = `${currentDate.getFullYear()}`;
    return checkDateLength(day, month, year);
  }, []);

  const addMessage = useCallback(
    (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        let comment = event.target.value;
        let messageKey = event.target.messageKey;
        let time = setTime();
        let date = setDate();
        event.target.value = "";
        event.target.messageKey = "";
        dispatch({
          type: "ADD_MESSAGE",
          payload: {
            messageDate: date,
            commentTime: time,
            comment: comment,
            key: messageKey,
          },
        });
      }
    },
    [dispatch, setTime, setDate]
  );

  useEffect(() => {
    let messageKey;
    let stateForEdit = messages.filter((obj, index) => {
      if (obj.currentMessageEdit) {
        messageKey = index;
        return obj.currentMessageEdit;
      }
      return null;
    })[0];
    if (stateForEdit) {
      let commentTextarea = document.querySelector(".commentTextarea");
      commentTextarea.value = stateForEdit.currentMessageEdit;
      commentTextarea.messageKey = messageKey;
    }
  }, [messages]);

  return (
    <FooterStyle>
      <FooterButton>
        <img src={attach} alt="attach" />
      </FooterButton>
      <FooterButton>
        <img src={microphone} alt="microphone" />
      </FooterButton>

      <MessageForm action="post" onKeyUp={addMessage}>
        <textarea
          className="commentTextarea"
          type="text"
          placeholder={`Message in ` + prop.chatName}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) e.preventDefault();
          }}
        ></textarea>
      </MessageForm>

      <FooterSmileButton>
        <img src={smile} alt="smile" />
      </FooterSmileButton>
    </FooterStyle>
  );
}

function checkDateLength(...args) {
  return args.map((item) => (item.length === 1 ? `0${item}` : item));
}

const FooterStyle = styled.footer`
  padding: 0 22px;
  height: 72px;
  border-top: 0.5px solid rgba(0, 0, 0, 0.24);
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const MessageForm = styled.form`
  margin-right: 20px;
  flex-grow: 1;
  display: flex;
  textarea {
    width: 100%;
    resize: none;
    height: 15px;
    margin-right: 20px;
  }
`;

const FooterButton = styled.button`
  margin-right: 21px;
  background: inherit;
`;

const FooterSmileButton = styled(FooterButton)`
  margin-right: 0;
`;
