import { useState } from 'react';
import { FAQ, questions} from '../../data/faq.tsx';

import styles from './FAQModal.module.css';
import UIButton from '../../icon/UIButton.tsx';

export const FAQModal = function() {
    const [faqIsOpen, setFaqIsOpen] = useState(false);
    
    const questionHtml = (questions as FAQ).map(({title, content}) => {
        return (
                <div>
                    <h3>{question}</h3>
                    <p>{answer}</p>
                </div>
            )
    });
    return (
        <>
            <UIButton 
                style={{height: "min-content", width: "min-content", padding:"5px"}}
                onClick={() => { setFaqIsOpen(true)}} selected={false} name={'FAQ'} 
            />
            <div className={styles.modalBackground}
                style={{
                    display: faqIsOpen ? "block" : "none",
                    position: "fixed",
                }}
            >
                <div className={styles.modalWindow}

                    >
                    <h2>FAQ</h2>
                    <div>
                        {questionHtml}
                    </div>
                    <UIButton 
                        style={{height: "min-content", width: "min-content", padding:"5px"}}
                        onClick={() => { setFaqIsOpen(false)}} selected={false} name={'close'} 
                    />

                </div>
            </div>
        </>
    );
};
