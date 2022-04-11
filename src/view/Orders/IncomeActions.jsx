import {inject, observer} from "mobx-react";
import {runInAction} from "mobx";
import {Form, Toast} from "react-bootstrap";
import React from "react";
import ModalWindow from "../../components/ModalWindow";
import {lang} from "../../lang";

const IncomeActions = inject('OrdersStore')(observer(({OrdersStore}) => (
    <>
        <ModalWindow
            title={OrdersStore.addIncome ? lang.addIncome : lang.rejectIncome}
            submitText={lang.yesPromptText}
            rejectText={lang.noPromptText}
            submitType='outline-info'
            show={OrdersStore.isShowIncomeWindowOpen}
            onClose={() => runInAction(() => (OrdersStore.isShowIncomeWindowOpen = false))}
            onSubmit={() => runInAction(() => {
                OrdersStore.incomePrompt = true
                OrdersStore.isShowIncomeWindowOpen = false
            })}
        >
            { OrdersStore.addIncome
                ? `Добавить новую продажу "${OrdersStore.nalogInfo.incomeName} №${OrdersStore.incomeNumber}"?`
                : <>
                    <p>{`Аннулировать чек по продаже "${OrdersStore.nalogInfo.incomeName} №${OrdersStore.incomeNumber}"?`}</p>
                    <p>{lang.reason}</p>
                    <Form>
                        <Form.Check
                            type='radio'
                            readOnly
                            checked={OrdersStore.rejectReason === lang.rejectReason.return}
                            value={lang.rejectReason.return}
                            label={lang.rejectReason.return}
                            onClick={() => runInAction(() => (OrdersStore.rejectReason = lang.rejectReason.return))}
                            id='radio-1'
                        />
                        <Form.Check
                            type='radio'
                            readOnly
                            checked={OrdersStore.rejectReason === lang.rejectReason.mistake}
                            value={lang.rejectReason.mistake}
                            label={lang.rejectReason.mistake}
                            onClick={() => runInAction(() => (OrdersStore.rejectReason = lang.rejectReason.mistake))}
                            id='radio-2'
                        />
                    </Form>
                </>
            }
        </ModalWindow>

        <Toast
            className='fixed-toast'
            onClose={() => runInAction(() => (OrdersStore.isShowNalogIncomeToast = false))}
            show={OrdersStore.isShowNalogIncomeToast}
            delay={50000}
            bg={'info'}
            autohide
        >
            <Toast.Header><strong className="me-auto">{lang.successAddIncome}</strong></Toast.Header>
            <Toast.Body style={{color: 'white'}}>
                <p>{OrdersStore.nalogInfo.incomeName} №{OrdersStore.incomeNumber}</p>
                <a style={{color: 'white'}} href={OrdersStore.receiptUrl} target='_blank'>{lang.yourRecipe}</a>
            </Toast.Body>
        </Toast>

        <Toast
            className='fixed-toast'
            onClose={() => runInAction(() => (OrdersStore.isShowRejectIncomeToast = false))}
            show={OrdersStore.isShowRejectIncomeToast}
            delay={50000}
            bg={'warning'}
            autohide
        >
            <Toast.Header><strong className="me-auto">{lang.successRejectIncome}</strong></Toast.Header>
            <Toast.Body style={{color: 'white'}}>
                <p>{OrdersStore.nalogInfo.incomeName} №{OrdersStore.incomeNumber}</p>
                <a style={{color: 'white'}} href={OrdersStore.receiptUrl} target='_blank'>{lang.rejectRecipe}</a>
            </Toast.Body>
        </Toast>
    </>
)))

export default IncomeActions