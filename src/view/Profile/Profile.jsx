import React, {useEffect} from "react";
import {useLocation} from "react-router-dom";
import {Button, Card, Form, Stack} from "react-bootstrap";
import {inject, observer} from "mobx-react";
import {runInAction} from "mobx";
import ToastNotify from "../../components/ToastNotify";
import EditProfile from "./EditProfile";
import MyNalogActions from "./MyNalogActions";
import Edit from "../../../public/icons/edit.svg";
import Delete from "../../../public/icons/delete.svg";
import EmptyCard from "../../../public/icons/emptyCard.svg";
import {lang} from "../../lang";


const Profile = inject("AuthStore")(observer(({AuthStore}) => {

    const location = useLocation()

    useEffect(() => {
        location.pathname.startsWith('/profile') && AuthStore.onInitProfile()
    }, [location.pathname])

    return (
        <div className='centered'>
            <Card style={{ width: '100%' }} border='light'>
                <Card.Body>
                    <Stack direction='horizontal' style={{marginBottom: 20}}>
                        {AuthStore.publicInfo?.photo.src
                            ? <Card.Img className='circle-image' variant='top' src={AuthStore.publicInfo?.photo.src}/>
                            : <EmptyCard/>
                        }

                        <Button
                            style={{marginBottom: 4, marginLeft: 5}}
                            onClick={() => runInAction(() => {
                                AuthStore.newPhoto = null
                                AuthStore.isEditPhotoWindowOpen = true
                            })}
                            variant="light"
                            size='sm'
                            className='my-btn'
                        >
                            <Edit/>
                        </Button>
                        { AuthStore.publicInfo?.photo.src &&
                            <Button
                                style={{marginBottom: 4}}
                                onClick={() => runInAction(() => {
                                    AuthStore.newPhoto = null
                                    AuthStore.isDeletePhotoWindowOpen = true
                                })}
                                variant="light"
                                size='sm'
                                className='my-btn'
                            >
                                <Delete/>
                            </Button>
                        }
                    </Stack>
                    <Stack direction='horizontal' style={{marginBottom: 20}}>
                        <Card.Title>{AuthStore.profile?.displayName || AuthStore.profile?.email}</Card.Title>
                        <Button
                            style={{marginBottom: 4}}
                            onClick={() => runInAction(() => {
                                AuthStore.newName = AuthStore.profile?.displayName || AuthStore.profile?.email
                                AuthStore.isEditNameWindowOpen = true
                            })}
                            variant="light"
                            size='sm'
                            className='my-btn'
                        >
                            <Edit/>
                        </Button>
                    </Stack>

                    <Form.Check
                        style={{marginBottom: 15}}
                        checked={AuthStore.nalogInfo.useMyNalogOption}
                        label={lang.profile.useMyNalogOption}
                        onChange={e => runInAction(() => {
                            e.target.checked
                                ? (AuthStore.isLoginToMyNalogWindowOpen = true)
                                :  AuthStore.onResetCheckMyNalogOption()
                        })}
                    />

                    {
                        AuthStore.nalogInfo.useMyNalogOption &&
                        <><Stack direction='horizontal'>
                            <Card.Subtitle>{lang.incomeName}</Card.Subtitle>
                            <Button
                                style={{marginBottom: 4}}
                                onClick={() => runInAction(() => {
                                    AuthStore.newIncomeName = AuthStore.nalogInfo.incomeName || ''
                                    AuthStore.isEditIncomeNameWindowOpen = true
                                })}
                                variant="light"
                                size='sm'
                                className='my-btn'
                            >
                                <Edit/>
                            </Button>
                        </Stack>
                        <Card.Text>{AuthStore.nalogInfo.incomeName || <p className="hint-warning">{lang.addIncomeName}</p>}</Card.Text></>
                    }

                    <Stack direction='horizontal'>
                        <Card.Subtitle>{lang.profile.email}</Card.Subtitle>
                        <Button
                            style={{marginBottom: 4}}
                            onClick={() => runInAction(() => {
                                AuthStore.email.value = AuthStore.profile?.email || ''
                                AuthStore.email.value && (AuthStore.email.valid = true)
                                AuthStore.isEditEmailWindowOpen = true
                            })}
                            variant="light"
                            size='sm'
                            className='my-btn'
                        >
                            <Edit/>
                        </Button>
                    </Stack>
                    <Card.Text>{AuthStore.profile?.email}</Card.Text>

                    <Button
                        style={{marginBottom: 20}}
                        variant="outline-secondary"
                        onClick={() => runInAction(() => {
                            AuthStore.email.value = AuthStore.profile?.email || ''
                            AuthStore.email.value && (AuthStore.email.valid = true)
                            AuthStore.isEditPasswordWindowOpen = true
                        })}
                    >
                        {lang.changePassword}
                    </Button>


                    <Card.Subtitle>{lang.profile.publicUrl}</Card.Subtitle>
                    <p>
                        <span className="hint">{lang.profile.publicUrlSub}</span><br/>
                        <span className="hint">{lang.profile.publicUrlSub2}</span>
                    </p>
                    <Card.Text><a href={AuthStore.publicUrl} target='_blank'>{AuthStore.publicUrl}</a></Card.Text>

                    <Stack direction='horizontal'>
                        <Card.Subtitle>{lang.profile.helpText}</Card.Subtitle>
                        <Button
                            style={{marginBottom: 4}}
                            onClick={() => runInAction(() => {
                                AuthStore.newHelpText = AuthStore.publicInfo.helpText
                                AuthStore.isEditHelpTextWindowOpen = true
                            })}
                            variant="light"
                            size='sm'
                            className='my-btn'
                        >
                            <Edit/>
                        </Button>
                    </Stack>
                    <Card.Text>{AuthStore.publicInfo.helpText? AuthStore.publicInfo.helpText.split('\n').map((row, index) => <span key={index}>{row}<br/></span>) : <span>&#8212;</span>}</Card.Text>

                    <Button
                        style={{marginBottom: 20}}
                        variant="outline-danger"
                        onClick={() => runInAction(() => (AuthStore.isDeleteAccountWindowOpen = true))}
                    >
                        {lang.deleteAccount}
                    </Button>
                </Card.Body>
            </Card>

            <MyNalogActions/>
            <EditProfile/>

            <ToastNotify
                show={AuthStore.isShowToast || false}
                onClose={() => runInAction(() => AuthStore.isShowToast = false)}
                text={AuthStore.toastText}
                isSuccess={!AuthStore.error}
            />
        </div>
    )
}))

export default Profile