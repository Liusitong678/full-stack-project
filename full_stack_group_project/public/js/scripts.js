'use strict'

const timeSlots = [
    "9:00", "9:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00"
];

const datePicker = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    $('#date').attr('min', formattedDate);
};

const initTimeSlot = () => {
    // Generate time slot buttons
    timeSlots.forEach(time => {
        // 创建按钮时不建议重复使用 id="time"，因此这里移除 id 属性 It is not recommended to reuse id="time" when creating buttons, so the id attribute is removed here
        const button = $(`<button class="time-slot" type="button">${time}</button>`);
        $("#timeButtons").append(button);

        // 修改：添加点击事件，点击时禁用当前按钮并恢复其他按钮 Modification: Add click event, disable the current button when clicked and restore other buttons
        button.click(function (event) {
            event.preventDefault();
            // 恢复所有按钮为可点击状态并移除 selected 类 Restore all buttons to clickable state and remove the selected class
            $(".time-slot").removeClass("selected").prop("disabled", false);
            // 将当前点击的按钮设置为 selected 并禁用 Set the currently clicked button to selected and disable it
            $(this).addClass("selected").prop("disabled", true);
            $("#selectedTime").val(time); // 更新隐藏输入框的值 Update the value of hidden input boxes
        });
    });
};

const checkTimeSlot = () => {
    $('#date').on('change', function () {
        const date = $(this).val();
        console.log('date was changed : ' + date);
        if (!date) return;

        // 清空之前的按钮 Clear the previous button
        $("#timeButtons").empty();

        // 请求服务器获取时间槽数据 Request the server to obtain time slot data
        $.ajax({
            url: '/appointment',
            method: 'GET',
            data: { date },
            success: function (response) {
                if (response.length === 0) {
                    // 如果服务器返回为空，则重新生成所有时间按钮 If the server returns empty, regenerate all time buttons
                    timeSlots.forEach((time) => {
                        const button = $(`<button class="time-slot available" type="button">${time}</button>`);
                        $("#timeButtons").append(button);

                        // 同样的点击事件处理：禁用当前按钮并恢复其他按钮 Same click event handling: disable the current button and restore other buttons
                        button.click(function (event) {
                            event.preventDefault();
                            $(".time-slot").removeClass("selected").prop("disabled", false);
                            $(this).addClass("selected").prop("disabled", true);
                            $("#selectedTime").val(time);
                        });
                    });
                    return;
                }
                // 如果服务器返回数据，则根据每个时间段是否存在预约来生成按钮 If the server returns data, generate buttons based on whether there is a reservation for each time period
                timeSlots.forEach((time) => {
                    // 检查是否该时间段已经被预约 Check if the time period has already been reserved
                    const slot = response.find((slot) => slot.time === time);
                    const isAvailable = slot ? false : true;

                    const button = $("<button>")
                        .addClass("time-slot")
                        .addClass(isAvailable ? "available" : "unavailable")
                        .prop("disabled", !isAvailable)
                        .attr("type", "button")
                        .text(time);

                    // 如果该时间段可用，则绑定点击事件 If the time period is available, bind the click event
                    if (isAvailable) {
                        button.click(function (event) {
                            event.preventDefault();
                            $(".time-slot").removeClass("selected").prop("disabled", false);
                            $(this).addClass("selected").prop("disabled", true);
                            $("#selectedTime").val(time);
                        });
                    }
                    $("#timeButtons").append(button);
                });
            },
            error: function () {
                alert('Failed to fetch time slots. Please try again.');
            }
        });
    })
};

const queryTimeSlot = () => {
    let selectedTimeId = null;

    $('#date').on('change', function () {
        const date = $(this).val();
        console.log('date was changed : ' + date);
        if (!date) return;

        // Clear previous buttons
        $('#timeButtons').empty();

        // Fetch available slots from the server
        $.ajax({
            url: '/appointment',
            method: 'GET',
            data: { date },
            success: function (response) {
                if (response.length === 0) {
                    $('#timeButtons').html('<p>No available slots for this date.</p>');
                    return;
                }
                $('#timeButtons').append('<br>');
                response.forEach(slot => {
                    const button = $('<button>')
                        .addClass('time-slot')
                        .text(slot.time)
                        .prop('disabled', !slot.isTimeSlotAvailable)
                        .toggleClass('booked', !slot.isTimeSlotAvailable)
                        .data('id', slot._id);

                    // 绑定点击事件：点击后设置按钮为选中并禁用 Binding Click Event: Set the button to be selected and disabled after clicking
                    if (slot.isTimeSlotAvailable) {
                        button.on('click', function (event) {
                            event.preventDefault();
                            $('.time-slot').removeClass('selected').prop("disabled", false);
                            $(this).addClass('selected').prop("disabled", true);
                            selectedTimeId = $(this).data('id');
                            $('#AppointmentId').val(selectedTimeId);
                        });
                    }

                    $('#timeButtons').append(button);
                });
            },
            error: function () {
                alert('Failed to fetch time slots. Please try again.');
            }
        });
    })
};

$(document).ready(() => {

    datePicker();

    if ($('#postAppointmentForm').val() != undefined) {
        initTimeSlot();
        checkTimeSlot();
    }

    if ($('#AppointmentId').val() != undefined) {
        queryTimeSlot();
    }
});

