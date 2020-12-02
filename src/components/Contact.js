import React from 'react';

const Contact = () => {
    return (
        <section className="page-section color">
            <br />
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <div className="contact-info">
                            <h2 className="block-title"><span>Lelanghobi</span></h2>
                            <div className="media-list">
                                <div className="media">
                                    <i className="pull-left fa fa-home"></i>
                                    <div className="media-body">
                                        <strong>Address:</strong><br />
                                            Jakarta Selatan. Indonesia
                                            </div>
                                </div>
                                <div className="media">
                                    <i className="pull-left fa fa-phone"></i>
                                    <div className="media-body">
                                        <strong>Telephone:</strong><br />
                                                (021) 1234-345-7689
                                            </div>



                                </div>
                                <div className="media">
                                    <div className="media-body">
                                        <strong>Customer Service:</strong><br />
                                        <a href="mailto:support@lelanghobi.com">support@lelanghobi.com</a>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="col-md-8 text-left">

                        <h2 className="block-title"><span>Hubungi Kami</span></h2>


                        <form name="contact-form" method="post" action="#" className="contact-form" id="contact-form">

                            <div className="outer required">
                                <div className="form-group af-inner">
                                    <label className="sr-only" for="name">Nama</label>
                                    <input
                                        type="text" name="name" id="name" placeholder="Nama" value="" size="30"
                                        data-toggle="tooltip" title="Name is required"
                                        className="form-control placeholder" />
                                </div>
                            </div>

                            <div className="outer required">
                                <div className="form-group af-inner">
                                    <label className="sr-only" for="email">Email</label>
                                    <input
                                        type="text" name="email" id="email" placeholder="Email" value="" size="30"
                                        data-toggle="tooltip" title="Email is required"
                                        className="form-control placeholder" />
                                </div>
                            </div>

                            <div className="outer required">
                                <div className="form-group af-inner">
                                    <label className="sr-only" for="subject">Subyek</label>
                                    <input
                                        type="text" name="subject" id="subject" placeholder="Subyek" value="" size="30"
                                        data-toggle="tooltip" title="Subject is required"
                                        className="form-control placeholder" />
                                </div>
                            </div>

                            <div className="form-group af-inner">
                                <label className="sr-only" for="input-message">Pesan Kamu</label>
                                <textarea
                                    name="message" id="input-message" placeholder="Pesan Kamu" rows="4" cols="50"
                                    data-toggle="tooltip" title="Message is required"
                                    className="form-control placeholder"></textarea>
                            </div>

                            <div className="outer required">
                                <div className="form-group af-inner">
                                    <input type="submit" name="submit" className="form-button form-button-submit btn btn-theme btn-theme-dark" id="submit_btn" value="Kirim Pesan" />
                                </div>
                            </div>

                        </form>


                    </div>

                </div>

            </div>
        </section >
    );
};

export default Contact;